interface Response {
  welcome: string;
  questions: {question: string; options: string[]; answer: string}[];
}
