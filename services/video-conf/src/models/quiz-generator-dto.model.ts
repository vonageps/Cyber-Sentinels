import {Model, model, property} from '@loopback/repository';

@model()
export class QuizGeneratorDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  jobDescription: string;

  constructor(data?: Partial<QuizGeneratorDto>) {
    super(data);
  }
}

export interface QuizGeneratorDtoRelations {
  // describe navigational properties here
}

export type QuizGeneratorDtoWithRelations = QuizGeneratorDto &
  QuizGeneratorDtoRelations;
