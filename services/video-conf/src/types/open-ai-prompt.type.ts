export interface OpenAiPrompt {
  model: LLMs;
  messages: {
    role: string;
    content: string;
  }[];
}

export enum LLMs {
  GPT4 = 'gpt-4',
  GPT35Turbo = 'gpt-3.5-turbo',
}
