import {Model, model, property} from '@loopback/repository';

@model()
export class CheckAnswerDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  question: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  options: string[];

  @property({
    type: 'string',
    required: true,
  })
  providedAnswer: string;

  @property({
    type: 'string',
    required: true,
  })
  expectedAnswer: string;

  constructor(data?: Partial<CheckAnswerDto>) {
    super(data);
  }
}

export interface CheckAnswerDtoRelations {
  // describe navigational properties here
}

export type CheckAnswerDtoWithRelations = CheckAnswerDto &
  CheckAnswerDtoRelations;
