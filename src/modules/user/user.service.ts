import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { AccountModel } from './models/account.model';
import { transaction } from 'objection';
import { getPasswordHash } from '../../shared/utils/hash-password';
import * as AWS from 'aws-sdk';
import * as Helper from '../../shared/utils/global.helper';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: 'ap-south-1',
  });
  async create(createUserDto: CreateUserDto) {
    const validate = await Helper.validate(createUserDto, UserModel);
    if (!validate.status) {
      throw new BadRequestException(validate.error);
    }
    const { password, email, username } = createUserDto;
    const hash = await getPasswordHash(password);
    createUserDto['uid'] = await getPasswordHash(username + email);

    createUserDto.password = hash;
    const newUser = await UserModel.query().insert(createUserDto);
    delete newUser['password'];
    return newUser;
  }

  async findAll() {
    let users = await UserModel.query().withGraphFetched('[account]');

    if (users.length > 0) {
      users.map(async (user) => {
        if (user['account']) {
          const filename = user['account']['avtar'];
          user['avtar_url'] = await this.getAvatar(filename);
        } else {
          user['avtar_url'] = '';
        }
      });
    }
    return users;

    // return Helper.sendResponse(true, Constants.LIST_SUCCESS, data);
  }

  async findOne(id: number) {
    const user = await UserModel.query()
      .findById(id)
      .withGraphFetched(
        '[account,created_projects,followed_projects.project,user_verifications.identity]',
      );

    if (user) {
      delete user['password'];
      if (user['account']) {
        const filename = user['account']['avtar'];
        user['avtar_url'] = await this.getAvatar(filename);
      }
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const validate = await Helper.validate(updateUserDto, UserModel, id);
    if (!validate.status) {
      throw new BadRequestException(validate.error);
    }
    try {
      const existuser = await UserModel.query().where('id', id).first();

      if (!existuser) {
        return false;
      }
      const result = await transaction(
        AccountModel,
        UserModel,
        async (AccountModel, UserModel) => {
          const existuserAccount = await AccountModel.query()
            .where('user_id', id)
            .first();
          const { username, email, subscribed } = updateUserDto;
          const account = Object.assign({}, updateUserDto['account'], {
            user_id: id,
          });

          const user = Object.assign(
            {},
            {
              username,
              email,
              subscribed,
            },
          );
          await UserModel.query().where('id', id).update(user);
          if (existuserAccount) {
            await AccountModel.query().where('user_id', id).patch(account);
            return true;
          } else {
            await AccountModel.query().insert(account);
            return true;
          }
        },
      );
      return result;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  remove(id: number) {
    return true;
    return `This action removes a #${id} user`;
  }

  async findByKey(key: string, value: any) {
    return await UserModel.query().where(key, value).first();
  }

  async updateUser(id: any, user: any) {
    return UserModel.query().where('id', id).patch(user);
  }

  async uploadAvtar(file) {
    const { originalname } = file;

    let ext = originalname.split('.');
    const fileExtention = ext[ext.length - 1];
    console.log(file);
    const crypto = require('crypto');
    const random = crypto.randomBytes(15).toString('hex');
    const filename = 'user_' + random + '.' + fileExtention;
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

  async getAvatar(filename) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: String(filename),
    };
    let s3Response: any = '';
    try {
      if (filename) {
        s3Response = await this.s3.getSignedUrl('getObject', params);
      }
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async attachAvtar(user_id, filename) {
    const accountDto = Object.assign(
      {},
      {
        avtar: filename,
        user_id: user_id,
        name: 'NA',
      },
    );
    console.log({ userid: user_id });
    const account = await AccountModel.query()
      .where('user_id', user_id)
      .first();

    if (account) {
      await AccountModel.query().where('user_id', user_id).patch(accountDto);
    } else {
      let status = await AccountModel.query().insert(accountDto);
      console.log({ status: status });
    }
    return true;
  }

  async getAvtarUrl(filename) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: String(filename),
    };

    try {
      let s3Response = await this.s3.getSignedUrl('getObject', params);
      console.log('===');
      console.log(s3Response);
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
