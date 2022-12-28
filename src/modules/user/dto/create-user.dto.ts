import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '@youba/nestjs-dbvalidator';
import {
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MinLength,
  Validate,
} from 'class-validator';

import { Express } from 'express';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  //@Validate(IsUnique, [{ table: 'users', column: 'username' }])
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  // @Validate(IsUnique, [{ table: 'users', column: 'email' }])
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  subscribed: boolean;
}

export class AdditionalUserInfo {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsOptional()
  describe: string;

  @ApiProperty()
  @IsOptional()
  twitter: string;

  @ApiProperty()
  @IsOptional()
  discord: string;

  @ApiProperty()
  @IsOptional()
  github: string;

  @ApiProperty()
  @IsOptional()
  interests: string[];
}
