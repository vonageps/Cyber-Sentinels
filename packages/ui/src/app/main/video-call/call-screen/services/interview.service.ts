import { Injectable } from "@angular/core";
import { AnswerJudgement, CheckedAnswer, Question, Quiz } from "src/app/types";

@Injectable()
export class InterviewService {
  quiz?: Quiz;
  currentState = 0;
  answerMap = new Map<
    Question,
    {
      answer: string;
      correct: boolean;
      userAnswer: string;
    }
  >();

  feedQuiz(quiz: Quiz) {
    this.quiz = quiz;
  }

  welcome() {
    if (!this.quiz) {
      return null;
    }
    return this.quiz.welcome;
  }

  next() {
    if (!this.quiz) {
      return null;
    }
    if (
      !this.quiz.questions.length ||
      this.currentState > this.quiz.questions.length
    ) {
      return null;
    }
    const current = this.quiz.questions[this.currentState];
    this.currentState++;
    return current;
  }

  answer(question: Question, analysis: CheckedAnswer, userAnswer: string) {
    const { selectedAnswer, answerJudgement } = analysis;
    if (answerJudgement === AnswerJudgement.correct) {
      this.answerMap.set(question, {
        answer: selectedAnswer,
        userAnswer,
        correct: true,
      });
    } else {
      this.answerMap.set(question, {
        answer: selectedAnswer,
        userAnswer,
        correct: false,
      });
    }
  }

  done() {
    return `Thank you for your time. You will now be redirected to the results page.`;
  }

  result() {
    if (!this.quiz) {
      return null;
    }
    const total = this.quiz.questions.length;
    const correct = Array.from(this.answerMap.values()).filter(
      (a) => a.correct
    ).length;
    return {
      total,
      correct,
      questions: this.quiz.questions.map((q) => ({
        question: q.question,
        answer: this.answerMap.get(q)?.answer,
        correct: this.answerMap.get(q)?.correct,
      })),
    };
  }

  reset() {
    this.quiz = undefined;
    this.currentState = 0;
  }
}
