import { Model } from 'objection';
import { AccountModel } from './account.model';
import { ProjectModel } from '../../project/models/project.model';
import { ProjectFollowerModel } from '../../project/models/projectFollower.model';
import { UserVerificationModel } from './user-verification.model';

export class UserModel extends Model {
  static query: any;

  static get tableName() {
    return 'users';
  }
  static get idColumn() {
    return 'id';
  }

  static rules() {
    return {
      username: 'unique',
      email: 'unique',
    };
  }

  static get relationMappings() {
    return {
      account: {
        relation: Model.HasOneRelation,
        modelClass: AccountModel,
        join: {
          from: 'users.id',
          to: 'accounts.user_id',
        },
      },
      created_projects: {
        relation: Model.HasManyRelation,
        modelClass: ProjectModel,
        join: {
          from: 'users.id',
          to: 'projects.user_id',
        },
      },
      followed_projects: {
        relation: Model.HasManyRelation,
        modelClass: ProjectFollowerModel,
        join: {
          from: 'users.id',
          to: 'project_followers.user_id',
        },
      },
      user_verifications: {
        relation: Model.HasManyRelation,
        modelClass: UserVerificationModel,
        join: {
          from: 'users.id',
          to: 'user_verification.user_id',
        },
      },
    };
  }
}
