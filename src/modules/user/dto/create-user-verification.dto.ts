import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserVerificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  verification_id: number;

  @ApiProperty()
  @IsNotEmpty()
  verification_data: any;
}

export class WebsiteVerificatioDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  verification_id: number;

  @ApiProperty()
  @IsNotEmpty()
  verification_data: any;
}
