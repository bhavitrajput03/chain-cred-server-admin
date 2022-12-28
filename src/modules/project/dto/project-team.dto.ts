import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class ProjectTeamDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // project_id: number;

  @ApiProperty()
  @IsNotEmpty()
  identity: number;

  @ApiProperty()
  @IsNotEmpty()
  is_cc_user: number;
}
