import { Injectable } from '@nestjs/common';
import { OtpDto } from './dto/otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordModel } from './models/reset-password.model';
import { UserService } from '../user/user.service';
import { getPasswordHash } from '../../shared/utils/hash-password';
import * as Constants from '../../shared/utils/global.constants';
import { MailService } from '../../mail/mail.service';

@Injectable({})
export class ResetPasswordService {
  constructor(
    private readonly userService: UserService,
    private mailService: MailService,
  ) {}

  async sendlink(otpDto: OtpDto) {
    const { email } = otpDto;
    const user = await this.userService.findByKey('email', email);
    if (user) {
      const random = Math.floor(Math.random() * 100 + 1);
      const random2 = Math.floor(Math.random() * 100 + 1);
      const expirein = new Date().getTime() + 300 * 1000;
      const code = String(random) + String(user['id']) + String(random2);
      const otpData = {
        code,
        user_id: user['id'],
        expire_in: expirein,
      };
      const otpRow = await ResetPasswordModel.query().insert(otpData);
      console.log(otpData);
      await this.mailService.sendResetPassword(email, code);
      return true;
    } else return false;
  }

  async verifylink(updatePasswordDto: UpdatePasswordDto) {
    const { code, password } = updatePasswordDto;
    const data = await ResetPasswordModel.query().findOne({ code });
    if (data) {
      const currentTime = new Date().getTime();
      const diff = +data['expire_in'] - currentTime;
      if (diff > 0) {
        const hash = await getPasswordHash(password);
        const user = await this.userService.findByKey('id', data['user_id']);
        user['password'] = hash;
        await this.userService.updateUser(user['id'], user);
        return { message: Constants.UPDATE_SUCCESS, success: true };
      } else return { message: Constants.TOKEN_EXPIRED, success: false };
    } else return { message: Constants.OTP_INCORRECT, success: false };
  }
}
