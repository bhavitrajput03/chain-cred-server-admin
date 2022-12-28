import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';
import { Request } from 'express';
import { JwtGuard } from '../../guard';
import { ApiTags } from '@nestjs/swagger';
import * as Helper from '../../shared/utils/global.helper';
import * as Constants from '../../shared/utils/global.constants';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('token')
  async getToken(@Body() signInDto: SignInDto) {
    const result = await this.authService.getToken(signInDto);
    if (result)
      return Helper.sendResponse(true, Constants.LOGIN_SUCCESS, result);
    else return Helper.sendResponse(false, Constants.LOGIN_FAILED);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const { user } = req;
    if (user) return Helper.sendResponse(true, Constants.READ_SUCCESS, user);
    else return Helper.sendResponse(false, Constants.READ_FAILED);
  }
}
