import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUnique } from '@youba/nestjs-dbvalidator';

export class CreateUpdateVerificationIdentifyDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  //@Validate(IsUnique, [{ table: 'verification_identity', column: 'code' }])
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  favicon_code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  secret: any;
}
