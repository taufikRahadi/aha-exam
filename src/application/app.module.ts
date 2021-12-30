import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from 'src/configs/database.config';
import { MailerConfigModule } from 'src/configs/mailer.config';
import { V0Module } from './api/v0/v0.module';

@Module({
  imports: [DatabaseConfigModule, V0Module, MailerConfigModule],
})
export class AppModule {}
