import { Injectable } from "@angular/core";
import { Quiz } from "src/app/types";

@Injectable()
export class InterviewService {
  quiz?: Quiz;
  currentState = -1;

  feedQuiz(quiz: Quiz) {
    this.quiz = quiz;
  }

  next() {
    if (this.currentState === -1) {
      return this.quiz?.welcome;
    }
    if (this.currentState === this.quiz?.questions.length) {
      return `Thank you for your time. You will see the results on the next screen`;
    }
    if (
      !this.quiz?.questions.length ||
      this.currentState > this.quiz?.questions.length
    ) {
      return null;
    }
    const current = this.quiz?.questions[this.currentState].question;
    this.currentState++;
    return current;
  }

  reset() {
    this.quiz = undefined;
    this.currentState = -1;
  }
}
