import { Schema } from './base';

export class NullSchema extends Schema<null> {

  constructor() {
    super('null');
  }

}
