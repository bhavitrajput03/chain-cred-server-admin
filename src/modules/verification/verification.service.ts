import { Injectable } from '@nestjs/common';
import { CreateUpdateVerificationIdentifyDto } from './dto/create-update-verification-identity.dto';
import { VerificationIdentityModel } from './models/verification-identity.model';
import * as Helper from '../../shared/utils/global.helper';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class VerificationIdentityService {
  constructor() {}
  async create(verificationDto: CreateUpdateVerificationIdentifyDto) {
    const validate = await Helper.validate(
      verificationDto,
      VerificationIdentityModel,
    );
    if (!validate.status) {
      throw new BadRequestException(validate.error);
    }

    const verification = await VerificationIdentityModel.query().insert({
      ...verificationDto,
    });
    return verification;
  }

  async findAll() {
    return await VerificationIdentityModel.query();
  }

  async findOne(id: number) {
    const project = await VerificationIdentityModel.query().findById(id);
    return project;
  }

  async update(
    id: number,
    verificationDto: CreateUpdateVerificationIdentifyDto,
  ) {
    const validate = await Helper.validate(
      verificationDto,
      VerificationIdentityModel,
      id,
    );
    if (!validate.status) {
      throw new BadRequestException(validate.error);
    }

    await VerificationIdentityModel.query()
      .where('id', id)
      .update(verificationDto);
    const updateProject = await VerificationIdentityModel.query().findById(id);
    return updateProject;
  }

  async remove(id: number) {
    const exist = await VerificationIdentityModel.query().findById(id);
    if (exist) {
      await VerificationIdentityModel.query().where('id', id).del();

      return true;
    }
    return false;
  }
}
