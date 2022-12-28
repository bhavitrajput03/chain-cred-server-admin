import { Model } from 'objection';

export class AccountModel extends Model {
  static query: any;

  static get tableName(): string {
    return 'accounts';
  }

  avtar: string;
  user_id: number;
  name: string;
}
