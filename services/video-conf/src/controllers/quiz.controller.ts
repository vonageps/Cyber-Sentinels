// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {post, requestBody} from '@loopback/openapi-v3';
import {CONTENT_TYPE, ErrorCodes, STATUS_CODE} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {QuizGeneratorDto} from '../models';
import {QuizGeneratorService} from '../services';

export class QuizController {
  constructor(
    @service(QuizGeneratorService)
    private readonly quizGeneratorService: QuizGeneratorService,
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
  async sendOtp(
    @requestBody()
    req: QuizGeneratorDto,
  ) {
    return this.quizGeneratorService.getQuiz(req);
  }
}
