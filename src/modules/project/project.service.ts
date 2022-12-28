import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ProjectModel } from './models/project.model';
import { ProjectTeamModel } from './models/projectTeam.model';
import { ProjectFollowerModel } from './models/projectFollower.model';
import * as AWS from 'aws-sdk';
import * as Helper from '../../shared/utils/global.helper';
import { BadRequestException } from '@nestjs/common';
import { get } from 'http';

@Injectable()
export class ProjectService {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: 'ap-south-1',
  });

  async uploadLogo(file) {
    const { originalname } = file;

    let ext = originalname.split('.');
    const fileExtention = ext[ext.length - 1];
    console.log(file);
    const crypto = require('crypto');
    const random = crypto.randomBytes(15).toString('hex');
    const filename = 'project_' + random + '.' + fileExtention;
    await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      filename,
      file.mimetype,
    );

    return filename;
  }
  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    console.log(params);

    try {
      let s3Response = await this.s3.upload(params).promise();
      console.log(s3Response);
    } catch (e) {
      console.log(e);
    }
  }
  async create(projectDto, user): Promise<ProjectModel> {
    const { id } = user;
    const { file, ...projectDtoActual } = projectDto;

    const validate = await Helper.validate(projectDtoActual, ProjectModel);
    if (!validate.status) {
      throw new BadRequestException(validate.error);
    }
    const newProject = await ProjectModel.query().insert({
      ...projectDtoActual,
      user_id: `${id}`,
    });
    return newProject;
  }

  async findAll() {
    let projects = await ProjectModel.query()
      .orderBy('projects.id', 'DESC')
      .withGraphFetched('[category, created_by]');
    if (projects.length > 0) {
      projects.map(async (project) => {
        project['logo_url'] = await this.getLogoUrl(project.logo);
      });
    }
    return projects;
  }

  async findOne(id: number) {
    const project = await ProjectModel.query()
      .findById(id)
      .withGraphFetched('[category, created_by,teams,ratings]');

    if (project) project['logo_url'] = await this.getLogoUrl(project.logo);
    return project;
  }

  async update(id: number, createUpdateProjectDto) {
    const validate = await Helper.validate(
      createUpdateProjectDto,
      ProjectModel,
      id,
    );
    if (!validate.status) {
      throw new BadRequestException(validate.error);
    }
    await ProjectModel.query().where('id', id).update(createUpdateProjectDto);
    const updateProject = await ProjectModel.query().findById(id);
    return updateProject;
  }

  async remove(id: number, user_id: any) {
    const exist = await ProjectModel.query()
      .where('user_id', user_id)
      .findById(id);
    if (exist) {
      await ProjectModel.query().where('id', id).del();
      return true;
    }
    return false;
  }

  async attachLogo(project_id, filename) {
    return await this.update(project_id, { logo: filename });
  }

  async getLogoUrl(filename) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: String(filename),
    };
    let s3Response: any = '';
    try {
      console.log(filename);
      if (filename) {
        s3Response = await this.s3.getSignedUrl('getObject', params);
      }
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async attachTeam(teams: any[], project_id: number) {
    console.log(project_id);
    const allTeamMember = await ProjectTeamModel.query()
      .where('project_id', project_id)
      .column(['identity']);
    console.log(allTeamMember);
    if (teams.length > 0) {
      teams.forEach(async (team: string) => {
        const teamObject = {
          project_id: project_id,
          identity: team,
          is_cc_user: 1,
        };
        const existTeam = await ProjectTeamModel.query()
          .where('identity', team)
          .where('project_id', project_id)
          .first();
        console.log(existTeam);
        if (!existTeam) {
          console.log('154' + existTeam);
          await ProjectTeamModel.query().insert(teamObject);
        }
      });
    }
  }

  async follow(followProjectDto, user) {
    const { project_id } = followProjectDto;
    const { id } = user;
    followProjectDto.user_id = id;
    delete followProjectDto.key;
    const follow = await ProjectFollowerModel.query()
      .where('user_id', id)
      .where('project_id', project_id)
      .first();

    if (!follow) {
      const newfollow = await ProjectFollowerModel.query().insert(
        followProjectDto,
      );
      return true;
    }
    return false;
  }

  async unfollow(followProjectDto, user) {
    const { project_id } = followProjectDto;
    const { id } = user;
    followProjectDto.user_id = id;
    delete followProjectDto.key;
    const follow = await ProjectFollowerModel.query()
      .where('user_id', id)
      .where('project_id', project_id)
      .first();

    if (follow) {
      await ProjectFollowerModel.query().deleteById(follow.id);
      return true;
    }
    return false;
  }

  async followedByUser(user) {
    return await ProjectFollowerModel.query().where('user_id', user.id);
  }

  
}
