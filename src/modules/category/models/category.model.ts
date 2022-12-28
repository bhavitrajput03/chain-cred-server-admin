import { Model } from 'objection';

export class CategoryModel extends Model {
  static query: any;
  static get tableName() {
    return 'category';
  }

  static rules() {
    return {
      name: 'unique',
    };
  }
}
