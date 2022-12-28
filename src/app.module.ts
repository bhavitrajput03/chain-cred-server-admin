import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ResetPasswordModule } from './modules/reset-password/reset-password.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { knexAsyncConfig } from './config/knex.config';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './modules/category/category.module';
import { VerificationIdentityModule } from './modules/verification/verification.module';
import { DbValidatorsModule } from '@youba/nestjs-dbvalidator';
import { MailModule } from './mail/mail.module';
require('dotenv').config({ path: __dirname + '../../.env' });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObjectionModule.registerAsync(knexAsyncConfig),
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.sendgrid.net',
    //     auth: {
    //       user: 'apikey',
    //       pass: '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',
    //     },
    //   },
    // }),
    UserModule,
    AuthModule,
    ResetPasswordModule,
    ProjectModule,
    CategoryModule,
    VerificationIdentityModule,
    MailModule,
    // DbValidatorsModule.register({
    //   type: process.env.DB_CLIENT,
    //   host: process.env.DB_HOST,
    //   port: Number(process.env.DB_PORT),
    //   database: process.env.DB_NAME,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    // }),
  ],
})
export class AppModule {}
