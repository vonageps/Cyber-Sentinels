// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {post, requestBody} from '@loopback/openapi-v3';
import {CONTENT_TYPE, ErrorCodes, STATUS_CODE} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {QuizGeneratorDto} from '../models';
import {QuizService} from '../services';
import { CheckAnswerDto } from '../models/check-answer-dto.model';

export class QuizController {
  constructor(
    @service(QuizService)
    private readonly quizGeneratorService: QuizService,
  ) {}

  @authorize({permissions: ['*']})
  @post('/quiz', {
    description: '',
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'Returns MCQ questions and correct answers for Job Description',
        content: {
          [CONTENT_TYPE.JSON]: Object,
        },
      },
      ...ErrorCodes,
    },
  })
  async generateQuiz(
    @requestBody()
    req: QuizGeneratorDto,
  ) {
    return this.quizGeneratorService.getQuiz(req);
  }

  @authorize({permissions: ['*']})
  @post('/check-answer', {
    description: '',
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'Returns analysis of the answer provided by the candidate',
        content: {
          [CONTENT_TYPE.JSON]: Object,
        },
      },
      ...ErrorCodes,
    },
  })
  async checkAnswer(
    @requestBody()
    req: CheckAnswerDto,
  ) {
    return this.quizGeneratorService.checkAnswer(req);
  }
}
