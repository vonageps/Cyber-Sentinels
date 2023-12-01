export interface CheckedAnswer {
  answerJudgement: AnswerJudgement;
  selectedAnswer: string;
}

export enum AnswerJudgement {
  correct = 'correct',
  incorrect = 'incorrect',
  repeat = 'repeat',
  skipped = 'skipped',
  unknown = 'unknown',
}
