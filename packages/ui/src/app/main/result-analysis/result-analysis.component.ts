import { Component } from '@angular/core';

@Component({
  selector: 'app-result-analysis',
  templateUrl: './result-analysis.component.html',
  styleUrls: ['./result-analysis.component.scss']
})
export class ResultAnalysisComponent {
  isOptionCorrect = true;
  questionnaires = [
    {
      question: '1. The purpose of the Front-end framework in Full stack development is ____.',
      options: [
        { text: 'To provide the client-side interface', correct: true },
        { text: 'To manage the database', correct: false },
        { text: 'To reduce the server load', correct: false },
        { text: 'To send HTTP requests', correct: false },
      ],
      feedback: {
        correct: 'Both A & C',
        confidenceScore: 100,
      },
    },
    {
      question: '2. Amongst which of the following programming language is used as a server-side language?',
      options: [
        { text: 'Python.', correct: false },
        { text: 'C++', correct: true },
        { text: 'JavaScript', correct: false },
        { text: 'Both A and C', correct: false },
      ],
      feedback: {
        correct: 'Both A & C',
        confidenceScore: 45,
      },
    },
    {
      question: '3. Database in Full stack development is used to ____.',
      options: [
        { text: 'Styling HTML pages', correct: false },
        { text: 'Storing and retrieving data', correct: true },
        { text: 'Handling errors on server-side', correct: false },
        { text: 'Rendering web pages', correct: false },
      ],
      feedback: {
        correct: 'Both A & C',
        confidenceScore: 100,
      },
    },
  ];
}
