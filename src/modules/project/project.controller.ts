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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';

import { ProjectService } from './project.service';
import { CreateUpdateProjectDto, FollowProjectDto } from './dto';
import { JwtGuard } from '../../guard';
import * as Helper from '../../shared/utils/global.helper';
import * as Constants from '../../shared/utils/global.constants';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Body() createUpdateProjectDto: CreateUpdateProjectDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const { teams, ...projectDto } = createUpdateProjectDto;
    projectDto['rating'] = 0;
    const project = await this.projectService.create(projectDto, user);
    if (teams && teams.length > 0) {
      await this.projectService.attachTeam(teams, project.id);
    }

    if (project) {
      if (file) {
        const filename = await this.projectService.uploadLogo(file);
        const result = await this.projectService.attachLogo(
          project.id,
          filename,
        );
      }
      return Helper.sendResponse(true, Constants.CREATE_SUCCESS, project);
    } else return Helper.sendResponse(false, Constants.CREATE_FAILED);
  }

  @Get()
  async findAll() {
    const data = await this.projectService.findAll();

    if (data.length > 0) {
      return Helper.sendResponse(true, Constants.LIST_SUCCESS, data);
    }

    return Helper.sendResponse(false, Constants.LIST_FAILED);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.projectService.findOne(+id);
    if (result)
      return Helper.sendResponse(true, Constants.READ_SUCCESS, result);
    else return Helper.sendResponse(false, Constants.READ_FAILED);
  }

  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createUpdateProjectDto: CreateUpdateProjectDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const { teams, ...projectDto } = createUpdateProjectDto;

    if (teams && teams.length > 0) {
      await this.projectService.attachTeam(teams, +id);
    }
    // const project = await this.projectService.update(+id, projectDto);
    // if (project)
    //   return Helper.sendResponse(true, Constants.UPDATE_SUCCESS, project);
    // else return Helper.sendResponse(false, Constants.UPDATE_FAILED);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const { user } = req;
    const project = await this.projectService.remove(+id, user['id']);
    if (project)
      return Helper.sendResponse(true, Constants.DELETE_SUCCESS, project);
    else return Helper.sendResponse(false, Constants.DELETE_FAILED);
  }

  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/logo/:project_id')
  async fileupload(
    @UploadedFile() file: Express.Multer.File,
    @Param('project_id') project_id: string,
  ) {
    const filename = await this.projectService.uploadLogo(file);
    const result = await this.projectService.attachLogo(project_id, filename);
    if (result) return Helper.sendResponse(true, Constants.UPDATE_SUCCESS);
    else return Helper.sendResponse(false, Constants.UPDATE_FAILED);
  }

  @UseGuards(JwtGuard)
  @Post('/follow/unfollow')
  async follow(
    @Body() followProjectDto: FollowProjectDto,
    @Req() req: Request,
  ) {
    const { key } = followProjectDto;
    const { user } = req;
    let message = '';
    let result = false;
    if (key === 'follow') {
      result = await this.projectService.follow(followProjectDto, user);
    } else if (key === 'unfollow') {
      result = await this.projectService.unfollow(followProjectDto, user);
    }
    if (result) return Helper.sendResponse(true, Constants.UPDATE_SUCCESS);
    else return Helper.sendResponse(false, Constants.UPDATE_FAILED);
  }

  @UseGuards(JwtGuard)
  @Get('followed/byuser')
  async followedByUser(@Req() req: Request) {
    const { user } = req;
    console.log('followed/byuser');
    const data = await this.projectService.followedByUser(user);
    if (data.length > 0)
      return Helper.sendResponse(true, Constants.LIST_SUCCESS, data);
    return Helper.sendResponse(false, Constants.LIST_FAILED);
  }
}
