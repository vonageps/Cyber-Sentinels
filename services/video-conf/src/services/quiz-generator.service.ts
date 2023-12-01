import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {QuizGeneratorDto} from '../models';
import {CheckAnswerDto} from '../models/check-answer-dto.model';
import {LLMs, OpenAiPrompt, OpenAiProxy} from '../types';
import {CheckedAnswerSchema, QuizSchema} from './constant';
import {JsonValidatorService} from './json-validator.service';
import {OpenAiProxyProvider} from './open-ai-proxy.service';

@injectable({scope: BindingScope.SINGLETON})
export class QuizService {
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
  countOfQuestions = Number(process.env.NOOFQUESTIONS ?? 10);
  constructor(
    @service(OpenAiProxyProvider) private readonly openApiService: OpenAiProxy,
    @service(JsonValidatorService)
    private readonly jsonValidatorService: JsonValidatorService,
  ) {}

  async getQuiz(body: QuizGeneratorDto) {
    const prompt = {
      model: (process.env.GPT_MODEL as LLMs) ?? LLMs.GPT4,
      messages: [
        {
          role: 'user',
          content: `I want to interview candidates for the following job description. Please suggest a welcome message and ${this.countOfQuestions} MCQs along with correct answers using which I can evaluate the technical expertise of the candidate. Return the questions and answers in a JSON format. Please ensure that the questions are of MCQ type and are extremely difficult and test the technical expertise of the candidate. The questions should be related to the technical intricacies of the frameworks/languages and should not have obvious answers within the job descriptions. The response should follow this structure (do not include the name of the interface in result) and should always have indexing like A, B, C and D before the options:
          interface Response {
            welcome: string;
            questions: {question: string; options: string[]; answer: string}[];
          }
          Job Description: ${body.jobDescription}`,
        },
      ],
    };
    return this.getCachedPrompt(prompt, QuizSchema);
  }

  async checkAnswer(body: CheckAnswerDto) {
    const prompt = {
      model: (process.env.GPT_MODEL as LLMs) ?? LLMs.GPT4,
      messages: [
        {
          role: 'user',
          content: `As an interviewer, I want to check the answer of the candidate for the following question: ${
            body.question
          }. The options given to the candidate were: ${body.options
            .map(v => `'${v}'`)
            .join(', ')} and the candidate's answer was "${
            body.providedAnswer
          }" and the expected answer was "${
            body.expectedAnswer
          }". Give the response as a json that follows this structure (do not include the name of interface in result):
          interface CheckedAnswer {
            answerJudgement: 'correct' | 'incorrect' | 'repeat' | 'skipped' | 'unknown';
            selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
          }
          Here the answerJudgement is correct if the candidate's answer is correct, incorrect if the candidate's answer is incorrect, repeat if the candidate's answer implies he wants to hear the question again, skipped if the candidate intends to skip the question and unknown if the answer does not fit any of other categories. The selectedAnswer is the answer among the options that is the closest match for the user's answer.
          selectedAnswer can be null only in case the judgement is 'repeat', 'skipped' or 'unknown'.
          `,
        },
      ],
    };
    return this.getCachedPrompt(prompt, CheckedAnswerSchema);
  }

  async getCachedPrompt(body: OpenAiPrompt, schema: any) {
    const key = JSON.stringify(body);
    const cached = this.cache.get(key);
    if (cached) {
      if (cached.time + this.ttl > Date.now()) {
        return cached.data;
      } else {
        this.cache.delete(key);
        this.cacheKeys = this.cacheKeys.filter(key => key !== key);
      }
    }
    const API_KEY = process.env.OPEN_API_KEY ?? '';
    let count = 1;
    const max_count = 3;
    while (count < max_count) {
      try {
        const res = await this.openApiService.prompt(body, API_KEY);
        const result = JSON.parse(res['choices'][0]['message']['content']);
        if (!result) throw new Error('Invalid response from OpenAI');
        this.jsonValidatorService.validate(schema, result);
        this.cache.set(key, {
          time: Date.now(),
          data: result,
        });
        this.cacheKeys.push(key);
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
