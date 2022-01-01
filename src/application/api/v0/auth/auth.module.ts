import { Module } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, NotificationService],
  exports: [AuthService, UserModule],
})
export class AuthModule {}
