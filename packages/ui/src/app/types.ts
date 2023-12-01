export type Profile = {
  id: string;
  name: string;
  jd: string;
  createdOn: string;
};

export type SessionResponse = {
  sessionId: string;
  token: string;
};

export enum SessionEvents {
  connected,
  published,
  streamcreated,
  streamdestroyed,
}

export type JdVectors = {
  jd_skills: {
    m_have_skills: string[];
    n_have_skills: string[];
    optional_skills: string[];
  };
  jd_vectors: {
    m_skill: any;
    n_skill: any;
    o_skill: any;
  };
};

export interface ParsedCV {
  candidate_parsed_info: CandidateParsedInfo;
  candidate_vectors: Array<number[]>;
  candidate_vector_profile: string;
}

export interface CandidateParsedInfo {
  name: string;
  tot_years_of_experience: string;
  skills: string[];
  education_and_specialization: string[];
  email_address: string[];
  phone_number: string[];
  location: string;
  certification_and_awards: any[];
  candidate_exposure: any[];
  designation: string;
}

export interface ScoreResponse {
  total_score: number;
}

export interface OTEvent {
  event: SessionEvents;
  data: any;
}

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface Quiz {
  welcome: string;
  questions: Question[];
}

export interface CheckedAnswer {
  answerJudgement: AnswerJudgement;
  selectedAnswer: string;
}

export enum AnswerJudgement {
  correct = "correct",
  incorrect = "incorrect",
  repeat = "repeat",
  skipped = "skipped",
  unknown = "unknown",
}
