import { Injectable } from '@nestjs/common';
import { CreateUpdateCategoryDto } from './dto';
import { CategoryModel } from './models/category.model';
import * as Helper from '../../shared/utils/global.helper';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CategoryService {
  async create(createUpdateCategoryDto: CreateUpdateCategoryDto, user) {
    const { id } = user;

    const validate = await Helper.validate(
      CreateUpdateCategoryDto,
      CategoryModel,
    );
    if (!validate.status) {
      throw new BadRequestException(validate.error);
    }
    const newobject = await CategoryModel.query().insert({
      ...createUpdateCategoryDto,
    });
    return newobject;
  }

  async findAll() {
    return await CategoryModel.query();
  }

  async findOne(id: number) {
    const entity = await CategoryModel.query().findById(id);
    return entity;
  }

  async update(id: number, createUpdateCategoryDto: CreateUpdateCategoryDto) {
    const validate = await Helper.validate(
      CreateUpdateCategoryDto,
      CategoryModel,
      id,
    );
    if (!validate.status) {
      throw new BadRequestException(validate.error);
    }
    await CategoryModel.query().where('id', id).update(createUpdateCategoryDto);
    const updateEntiry = await CategoryModel.query().findById(id);
    return updateEntiry;
  }

  async remove(id: number) {
    return await `This action removes a #${id} project form projects`;
  }
}
