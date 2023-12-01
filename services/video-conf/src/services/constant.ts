import {AnswerJudgement} from '../types';

export const QuizSchema = {
  type: 'object',
  properties: {
    welcome: {
      type: 'string',
    },
    questions: {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            question: {
              type: 'string',
            },
            options: {
              type: 'array',
              items: [
                {
                  type: 'string',
                },
              ],
            },
            answer: {
              type: 'string',
            },
          },
          required: ['question', 'options', 'answer'],
        },
      ],
    },
  },
  required: ['welcome', 'questions'],
};

export const CheckedAnswerSchema = {
  type: 'object',
  properties: {
    answerJudgement: {
      type: 'string',
      enum: Object.keys(AnswerJudgement),
    },
    selectedAnswer: {
      type: ['string', 'null'],
      enum: ['A', 'B', 'C', 'D', null],
    },
  },
  required: ['answerJudgement', 'selectedAnswer'],
};
