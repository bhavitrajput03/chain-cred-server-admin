import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, UserService],
})
export class ResetPasswordModule {}
