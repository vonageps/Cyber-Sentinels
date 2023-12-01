import {AnyObject} from '@loopback/repository';

export interface OpenAiProxy {
  prompt(body: AnyObject, token: string): Promise<AnyObject>;
}
