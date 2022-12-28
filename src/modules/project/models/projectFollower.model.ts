import { Model } from 'objection';
import { ProjectModel } from './project.model';

export class ProjectFollowerModel extends Model {
  static query: any;
  static get tableName() {
    return 'project_followers';
  }

  id: any;

  static get relationMappings() {
    return {
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: ProjectModel,
        join: {
          from: 'project_followers.project_id',
          to: 'projects.id',
        },
      },
    };
  }
}
