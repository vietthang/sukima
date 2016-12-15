import { BaseSchema } from './base';

export class BooleanSchema extends BaseSchema<boolean, boolean, boolean> {

  constructor() {
    super('boolean');
  }

}
