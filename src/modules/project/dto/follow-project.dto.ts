import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class FollowProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  project_id: number;

  @ApiProperty()
  @IsNotEmpty()
  key: string;
}
