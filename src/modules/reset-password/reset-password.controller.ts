import { Body, Controller, Post } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { OtpDto } from './dto/otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';
import * as Helper from '../../shared/utils/global.helper';
import * as Constants from '../../shared/utils/global.constants';

@ApiTags('Password')
@Controller('reset-password')
export class ResetPasswordController {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @Post('send-link')
  async sendlink(@Body() otpDto: OtpDto) {
    const status = await this.resetPasswordService.sendlink(otpDto);
    if (status) return Helper.sendResponse(true, Constants.OTP_SUCCESS);
    else return Helper.sendResponse(false, Constants.OTP_FAILED);
  }

  @Post('verify-link')
  async verifylink(@Body() updatePasswordDto: UpdatePasswordDto) {
    console.log(updatePasswordDto);
    const response = await this.resetPasswordService.verifylink(
      updatePasswordDto,
    );
    if (response['success']) {
      return Helper.sendResponse(true, response['message']);
    } else {
      console.log(response['message']); //
      return Helper.sendResponse(false, response['message']);
    }
  }
}
