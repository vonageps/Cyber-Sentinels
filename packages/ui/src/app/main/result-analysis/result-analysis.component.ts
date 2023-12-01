import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/app/types';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-result-analysis',
  templateUrl: './result-analysis.component.html',
  styleUrls: ['./result-analysis.component.scss'],
})
export class ResultAnalysisComponent {
  data: any;
  passPercentage = environment.passPercentage;
  pass = false;
  questionnaires: any[] = [];
  now = this.formatDate(Date.now());
  profile?: Profile;
  constructor(private readonly router: Router) {
    this.data = this.router.getCurrentNavigation()!.extras.state;
    this.profile = this.data.profile;
    this.setPassStatus();
    this.populateQuestionnaires();
  }
  populateQuestionnaires() {
    this.questionnaires = [];
    this.data.questions.forEach((q: any) => {
      this.questionnaires.push({
        question: q.question.question,
        options: q.question.options.map((o: any, index: number) => ({
          text: o,
          checked: index === this.getAnswerIndex(q.answer),
        })),
        correct: q.question.options[this.getAnswerIndex(q.answer)] === q.question.answer || q.correct,
        answer: q.question.answer,
        userAnswer: q.userAnswer,
        showString: !q.answer
      });
    });
  }
  setPassStatus() {
    if ((this.data.correct / this.data.total) * 100 > this.passPercentage) {
      this.pass = true;
    }
  }

  getAnswerIndex(ans: string) {
    return ['A', 'B', 'C', 'D'].indexOf(ans);
  }

  formatDate(dateNum: number) {
    const date = new Date(dateNum);
    let hours = date.getHours();
    let minutes: string | number = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }
}
