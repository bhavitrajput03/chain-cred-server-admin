import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto, AdditionalUserInfo } from './create-user.dto';

export class UserDtoWithOutPassword extends OmitType(CreateUserDto, [
  'password',
] as const) {}

export class UpdateUserDto extends IntersectionType(
  UserDtoWithOutPassword,
  AdditionalUserInfo,
) {}
