import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {OpenAiDataSource} from '../datasources';
import {OpenAiProxy} from '../types';

export class OpenAiProxyProvider implements Provider<OpenAiProxy> {
  constructor(
    @inject('datasources.OpenAi')
    protected dataSource: OpenAiDataSource,
  ) {}

  value(): Promise<OpenAiProxy> {
    return getService(this.dataSource);
  }
}
