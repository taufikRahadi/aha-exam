import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (env: ConfigService) => ({
        transport: {
          host: env.get<string>('SMTP_HOST'),
          port: env.get<number>('SMTP_PORT'),
          secure: true,
          auth: {
            user: env.get<string>('SMTP_AUTH_USER'),
            pass: env.get<string>('SMTP_AUTH_PASS'),
          },
        },
        template: {
          dir: join(process.cwd(), 'src/resources/email-templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailerConfigModule {}
