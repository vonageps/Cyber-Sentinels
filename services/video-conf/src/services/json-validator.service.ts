import {BindingScope, injectable} from '@loopback/context';
import Ajv from 'ajv';

@injectable({scope: BindingScope.SINGLETON})
export class JsonValidatorService {
  ajv: Ajv;
  constructor() {
    this.ajv = new Ajv({allErrors: true});
  }
  validate(schema: any, data: any) {
    const validate = this.ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      throw new Error(JSON.stringify(validate.errors));
    }
    return valid;
  }
}
