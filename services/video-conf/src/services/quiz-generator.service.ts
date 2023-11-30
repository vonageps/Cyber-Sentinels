import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {QuizGeneratorDto} from '../models';
import {OpenAiProxy} from '../types';
import {OpenAiProxyProvider} from './open-ai-proxy.service';

@injectable({scope: BindingScope.SINGLETON})
export class QuizGeneratorService {
  cache = new Map<
    string,
    {
      time: number;
      data: any;
    }
  >();
  cacheKeys: string[] = [];
  ttl: number = 1000 * 60 * 60 * 1; // 1 hour
  maxCached: number = 10;
  constructor(
    @service(OpenAiProxyProvider) private readonly openApiService: OpenAiProxy,
  ) {}

  async getQuiz(body: QuizGeneratorDto) {
    return this.getQuizCached(body);
  }

  async getQuizCached(body: QuizGeneratorDto) {
    const cached = this.cache.get(body.jobDescription);
    if (cached) {
      if (cached.time + this.ttl > Date.now()) {
        return cached.data;
      } else {
        this.cache.delete(body.jobDescription);
        this.cacheKeys = this.cacheKeys.filter(
          key => key !== body.jobDescription,
        );
      }
    }
    const API_KEY = process.env.OPEN_API_KEY ?? '';
    let count = 1;
    const max_count = 3;
    while (count < max_count) {
      try {
        const res = await this.openApiService.getQuiz(
          {
            model: 'gpt-4',
            messages: [
              {
                role: 'user',
                content: `I want to interview candidates for the following job description. Please suggest a welcome message and 10 MCQs along with correct answers using which I can evaluate the technical expertise of the candidate. Return the questions and answers in a JSON format. Please ensure that the questions are of MCQ type and are extremely difficult and test the technical expertise of the candidate. The questions should be related to the technical intricacies of the frameworks/languages and should not have obvious answers within the job descriptions. The response should follow this structure:
                interface Response {
                  welcome: string;
                  questions: {question: string; options: string[]; answer: string}[];
                }
                Job Description: ${body.jobDescription}`,
              },
            ],
          },
          API_KEY,
        );
        const result = JSON.parse(res['choices'][0]['message']['content']);
        this.cache.set(body.jobDescription, {
          time: Date.now(),
          data: result,
        });
        this.cacheKeys.push(body.jobDescription);
        if (cached && this.cacheKeys.length > 10) {
          const key = this.cacheKeys.shift();
          if (key) {
            this.cache.delete(key);
          }
        }
        return result;
      } catch (err) {
        if (count >= max_count) {
          throw err;
        }
        count++;
      }
    }
  }
}
