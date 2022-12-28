import { Model } from 'objection';

export class VerificationIdentityModel extends Model {
  static query: any;

  static get tableName() {
    return 'verification_identity';
  }

  static rules() {
    return {
      code: 'unique',
    };
  }
}
