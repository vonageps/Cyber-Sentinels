import {AnyObject} from '@loopback/repository';

export interface OpenAiProxy {
  getQuiz(body: AnyObject, token: string): Promise<AnyObject>;
}
