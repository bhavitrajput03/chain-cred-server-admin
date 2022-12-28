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
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { VerificationIdentityService } from './verification.service';
import { CreateUpdateVerificationIdentifyDto } from './dto/create-update-verification-identity.dto';
import { JwtGuard } from '../../guard';
import * as Helper from '../../shared/utils/global.helper';
import * as Constants from '../../shared/utils/global.constants';

@ApiTags('Verification')
@Controller('verification/identity')
export class VerificationIdentityController {
  constructor(
    private readonly verificationService: VerificationIdentityService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() verificationDto: CreateUpdateVerificationIdentifyDto,
    @Req() req: Request,
  ) {
    const result = await this.verificationService.create(verificationDto);
    if (result)
      return Helper.sendResponse(true, Constants.CREATE_SUCCESS, result);
    else return Helper.sendResponse(false, Constants.CREATE_FAILED);
  }

  @Get()
  async findAll() {
    const data = await this.verificationService.findAll();
    if (data.length > 0)
      return Helper.sendResponse(true, Constants.LIST_SUCCESS, data);
    return Helper.sendResponse(false, Constants.LIST_FAILED);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.verificationService.findOne(+id);
    if (result)
      return Helper.sendResponse(true, Constants.READ_SUCCESS, result);
    else return Helper.sendResponse(false, Constants.READ_FAILED);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: string,
    @Body() verificationDto: CreateUpdateVerificationIdentifyDto,
  ) {
    const rating = await this.verificationService.update(+id, verificationDto);
    if (rating) return Helper.sendResponse(true, Constants.UPDATE_SUCCESS);
    else return Helper.sendResponse(false, Constants.UPDATE_FAILED);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string) {
    const rating = await this.verificationService.remove(+id);
    if (rating) return Helper.sendResponse(true, Constants.DELETE_SUCCESS);
    else return Helper.sendResponse(false, Constants.DELETE_FAILED);
  }
}
