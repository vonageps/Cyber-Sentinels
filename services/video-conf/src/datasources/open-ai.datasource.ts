import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

export const OpenAiConfig = {
  name: 'OpenAiService',
  connector: 'rest',
  baseURL: '',
  crud: false,
  options: {
    baseUrl: '',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: `https://api.openai.com/v1/chat/completions`,
        headers: {
          Authorization: 'Bearer {token}',
        },
        body: '{body}',
      },
      functions: {
        prompt: ['body', 'token'],
      },
    },
  ],
};

@lifeCycleObserver('datasource')
export class OpenAiDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'OpenAi';
  static readonly defaultConfig = OpenAiConfig;

  constructor(
    @inject('datasources.config.OpenAi', {optional: true})
    dsConfig: object = OpenAiConfig,
  ) {
    const dsConfigJson = {
      ...dsConfig,
      options: {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
      },
    };
    super(dsConfigJson);
  }
}
