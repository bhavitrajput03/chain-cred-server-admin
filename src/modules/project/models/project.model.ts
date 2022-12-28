import { Model } from 'objection';
import { CategoryModel } from '../../category/models/category.model';
import { UserModel } from '../../user/models/user.model';
import { ProjectTeamModel } from './projectTeam.model';

export class ProjectModel extends Model {
  static query: any;
  static get tableName() {
    return 'projects';
  }

  id: any;
  logo: string;

  static rules() {
    return {
      name: 'unique',
    };
  }

  static get relationMappings() {
    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: CategoryModel,
        join: {
          from: 'projects.category_id',
          to: 'category.id',
        },
        filter: (query) => query.select('id', 'name', 'description'),
      },
      created_by: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'projects.user_id',
          to: 'users.id',
        },
        filter: (query) => query.select('id', 'username', 'email'),
      },
      teams: {
        relation: Model.HasManyRelation,
        modelClass: ProjectTeamModel,
        join: {
          from: 'projects.id',
          to: 'project_teams.project_id',
        },
      },
    };
  }
}
