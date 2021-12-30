import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmailVerification(email: string, payload: any) {
    try {
      const token = sign(
        {
          email,
        },
        'Aha-Email-Verification',
        {
          expiresIn: '1h',
        },
      );

      await this.mailerService.sendMail({
        from: this.configService.get<string>('SMTP_AUTH_USER'),
        to: email,
        subject: 'EMAIL VERIFICATION LINK',
        template: './verification.hbs',
        context: {
          name: payload.name,
          url: `${this.configService.get<string>(
            'FRONTEND_URL',
          )}/auth/email-verification/${token}`,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
