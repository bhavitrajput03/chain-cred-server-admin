import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateUpdateCategoryDto } from './dto';
import { JwtGuard } from '../../guard';
import * as Helper from '../../shared/utils/global.helper';
import * as Constants from '../../shared/utils/global.constants';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() createUpdateCategoryDto: CreateUpdateCategoryDto,
    @Req() req: Request,
  ) {
    const { user } = req;
    const result = await this.categoryService.create(
      createUpdateCategoryDto,
      user,
    );

    if (result)
      return Helper.sendResponse(true, Constants.CREATE_SUCCESS, result);
    else return Helper.sendResponse(false, Constants.CREATE_FAILED);
  }

  @Get()
  async findAll() {
    const data = await this.categoryService.findAll();
    if (data.length > 0)
      return Helper.sendResponse(true, Constants.LIST_SUCCESS, data);
    return Helper.sendResponse(false, Constants.LIST_FAILED);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.categoryService.findOne(+id);
    if (result)
      return Helper.sendResponse(true, Constants.READ_SUCCESS, result);
    else return Helper.sendResponse(false, Constants.READ_FAILED);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createUpdateCategoryDto: CreateUpdateCategoryDto,
  ) {
    const rating = await this.categoryService.update(
      +id,
      createUpdateCategoryDto,
    );
    if (rating) return Helper.sendResponse(true, Constants.UPDATE_SUCCESS);
    else return Helper.sendResponse(false, Constants.UPDATE_FAILED);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const rating = await this.categoryService.remove(+id);
    if (rating) return Helper.sendResponse(true, Constants.DELETE_SUCCESS);
    else return Helper.sendResponse(false, Constants.DELETE_FAILED);
  }
}
