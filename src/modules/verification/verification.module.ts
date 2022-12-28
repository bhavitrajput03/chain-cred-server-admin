import { Module } from '@nestjs/common';
import { VerificationIdentityController } from './verification.controller';
import { VerificationIdentityService } from './verification.service';

@Module({
  controllers: [VerificationIdentityController],
  providers: [VerificationIdentityService],
})
export class VerificationIdentityModule {}
