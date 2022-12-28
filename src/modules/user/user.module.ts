import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserVerificationService } from './user-verification.service';
import { UserVerificationController } from './user-verification.controller';
import { HttpModule } from '@nestjs/axios';
import { VerificationIdentityService } from '../verification/verification.service';
import { MailModule } from '../../mail/mail.module';

@Module({
  controllers: [UserController, UserVerificationController],
  providers: [
    UserService,
    UserVerificationService,
    VerificationIdentityService,
  ],
  imports: [HttpModule],
})
export class UserModule {}
