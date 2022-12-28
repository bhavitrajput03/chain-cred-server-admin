import { Model } from 'objection';

export class ProjectTeamModel extends Model {
  static query: any;
  static get tableName() {
    return 'project_teams';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['project_id', 'identity'],

      properties: {
        id: { type: 'integer' },
        project_id: { type: ['integer', 'null'] },
        identity: { type: ['string', 'null'] },
        is_cc_user: { type: ['integer', 'null'] },
      },
    };
  }
}
