import { Model } from 'objection';

export class ResetPasswordModel extends Model {
  static query: any;
  static get tableName(): string {
    return 'reset_password';
  }
}
