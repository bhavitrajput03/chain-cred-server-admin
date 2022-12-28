import { Model } from 'objection';
import { VerificationIdentityModel } from 'src/modules/verification/models/verification-identity.model';

export class UserVerificationModel extends Model {
  static query: any;
  static get tableName() {
    return 'user_verification';
  }
  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    return {
      identity: {
        relation: Model.HasOneRelation,
        modelClass: VerificationIdentityModel,
        join: {
          from: 'user_verification.verification_id',
          to: 'verification_identity.id',
        },
      },
    };
  }
}
