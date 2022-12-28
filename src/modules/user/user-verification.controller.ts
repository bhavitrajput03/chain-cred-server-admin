import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserVerificationService } from './user-verification.service';
import { CreateUserVerificationDto } from './dto/create-user-verification.dto';
import { JwtGuard } from '../../guard';
import * as Helper from '../../shared/utils/global.helper';
import * as Constants from '../../shared/utils/global.constants';
import { MailService } from '../../mail/mail.service';

@ApiTags('User-Verification')
@Controller('verification/user')
export class UserVerificationController {
  constructor(
    private readonly userVerService: UserVerificationService,
    private mailService: MailService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() createVerificationDto: CreateUserVerificationDto,
    @Req() req: Request,
  ) {
    const { user } = req;
    const result = await this.userVerService.create(
      createVerificationDto,
      user,
    );

    if (result)
      return Helper.sendResponse(true, Constants.CREATE_SUCCESS, result);
    else return Helper.sendResponse(false, Constants.CREATE_FAILED);
  }

  @Post('/sendOtp')
  @UseGuards(JwtGuard)
  async sendOtp(@Body() createVerificationDto: CreateUserVerificationDto) {
    const { address } = createVerificationDto.verification_data;
    this.mailService.sendUserConfirmation(address, 1234);
    if (true) return Helper.sendResponse(true, Constants.OTP_SUCCESS);
  }

  @Get()
  async findAll() {
    const data = await this.userVerService.findAll();
    if (data.length > 0)
      return Helper.sendResponse(true, Constants.LIST_SUCCESS, data);
    return Helper.sendResponse(false, Constants.LIST_FAILED);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.userVerService.findOne(+id);
    if (result)
      return Helper.sendResponse(true, Constants.READ_SUCCESS, result);
    else return Helper.sendResponse(false, Constants.READ_FAILED);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createVerificationDto: CreateUserVerificationDto,
  ) {
    const rating = await this.userVerService.update(+id, createVerificationDto);
    if (rating) return Helper.sendResponse(true, Constants.UPDATE_SUCCESS);
    else return Helper.sendResponse(false, Constants.UPDATE_FAILED);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const rating = await this.userVerService.remove(+id);
    if (rating) return Helper.sendResponse(true, Constants.DELETE_SUCCESS);
    else return Helper.sendResponse(false, Constants.DELETE_FAILED);
  }
}
