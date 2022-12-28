import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from '../../guard';
import { Express } from 'express';
import * as Helper from '../../shared/utils/global.helper';
import * as Constants from '../../shared/utils/global.constants';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    if (user) {
      return Helper.sendResponse(true, Constants.CREATE_SUCCESS, user);
    } else return Helper.sendResponse(false, Constants.CREATE_FAILED);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    if (data.length > 0)
      return Helper.sendResponse(true, Constants.LIST_SUCCESS, data);
    return Helper.sendResponse(false, Constants.LIST_FAILED);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (user) return Helper.sendResponse(true, Constants.READ_SUCCESS, user);
    else return Helper.sendResponse(false, Constants.READ_FAILED);
  }

  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const status = await this.userService.update(+id, updateUserDto);
    console.log(status);
    if (status) {
      if (file) {
        const filename = await this.userService.uploadAvtar(file);
        const status = await this.userService.attachAvtar(id, filename);
      }

      return Helper.sendResponse(true, Constants.UPDATE_SUCCESS);
    } else return Helper.sendResponse(false, Constants.UPDATE_FAILED);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    const status = this.userService.remove(+id);
    if (status) return Helper.sendResponse(true, Constants.DELETE_SUCCESS);
    else return Helper.sendResponse(false, Constants.DELETE_FAILED);
  }

  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/avtar/:user_id')
  async fileupload(
    @UploadedFile() file: Express.Multer.File,
    @Param('user_id') user_id: string,
  ) {
    const filename = await this.userService.uploadAvtar(file);
    const status = await this.userService.attachAvtar(user_id, filename);
    if (status) return Helper.sendResponse(true, Constants.UPDATE_SUCCESS);
    else return Helper.sendResponse(false, Constants.UPDATE_FAILED);
  }
}
