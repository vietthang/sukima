import { BaseSchema } from './base';

export class NullSchema extends BaseSchema<null, null, null> {

  constructor() {
    super('null');
  }

}
