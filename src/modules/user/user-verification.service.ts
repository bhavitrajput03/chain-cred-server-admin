import { Injectable } from '@nestjs/common';
import { CreateUserVerificationDto } from './dto/create-user-verification.dto';
import { UserVerificationModel } from './models/user-verification.model';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';
import { VerificationIdentityService } from '../verification/verification.service';

@Injectable()
export class UserVerificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly verificationIdentity: VerificationIdentityService,
  ) {}
  async create(createVerificationDto: CreateUserVerificationDto, user) {
    const { id } = user;
    const { verification_id } = createVerificationDto;
    const verificationIdentity = await this.verificationIdentity.findOne(
      verification_id,
    );
    if (verificationIdentity && verificationIdentity['code'] == 'website') {
      const status = await this.checkWebsiteVerification(
        createVerificationDto,
        user,
      );
      if (!status) {
        return false;
      }
    } else if (
      verificationIdentity &&
      verificationIdentity['code'] == 'email'
    ) {
      const status = await this.checkEmailVerification(
        createVerificationDto,
        user,
      );
      if (!status) {
        return false;
      }
    }
    const verification = await UserVerificationModel.query().insert({
      ...createVerificationDto,
      user_id: `${id}`,
    });
    return verification;
  }

  async findAll() {
    return await UserVerificationModel.query();
  }

  async findOne(id: number) {
    const verification = await UserVerificationModel.query().findById(id);
    return verification;
  }

  async update(id: number, createVerificationDto: CreateUserVerificationDto) {
    await UserVerificationModel.query()
      .where('id', id)
      .update(createVerificationDto);
    const verification = await UserVerificationModel.query().findById(id);
    return verification;
  }

  async remove(id: number) {
    const exist = await UserVerificationModel.query().findById(id);
    if (exist) {
      await UserVerificationModel.query().where('id', id).del();
      return true;
    }
    return false;
  }

  async checkWebsiteVerification(verificationDto, user) {
    const { verification_data } = verificationDto;
    const { address } = verification_data;
    return true;
    // const { data } = await lastValueFrom(
    //   this.httpService.get<any>(address).pipe(
    //     map((response) => {
    //       return response.data;
    //     }),
    //   ),
    // );

    // if (data) {
    //   console.log(data);
    //   return data.search(user.uid) ? true : false;
    // }
    // console.log(data);
    // return false;
  }

  async checkEmailVerification(verificationDto, user) {
    const { verification_data } = verificationDto;
    const { address } = verification_data;
    const { otp } = verification_data;
    if (otp == 1234) {
      return true;
    } else return false;
  }
}
