import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user, token) {
    await this.mailerService.sendMail({
      to: user,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Chaincred App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: '',
        token,
      },
    });
  }

  async sendResetPassword(email, token) {
    const url = `https://staging.chaincred.cc/password/reset/key/${token}`;

    console.log('url:' + url);
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Reset your Password to Chaincred App!',
      template: './reset-password', // `.hbs` extension is appended automatically
      context: {
        url,
      },
    });
  }
}
