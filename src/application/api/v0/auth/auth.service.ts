import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/application/schemas/user.schema';
import { UserService } from '../user/user.service';
import { SignInResponseDto, SignInUserDto } from './auth.dto';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  async signUpUser(payload: User) {
    try {
      const findUser = await this.userService.findUserByEmail(payload.email);

      if (findUser)
        throw new BadRequestException(`Email has already been used`);

      const user = await this.userService.createUser(payload);

      await this.notificationService.sendEmailVerification(user.email, {
        fullname: user.fullname,
        email: user.email,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signInUser(payload: SignInUserDto): Promise<SignInResponseDto> {
    try {
      const user = await this.userService.findUserByEmail(payload.email);

      if (!user)
        throw new BadRequestException(
          `User with email '${payload.email}' not found`,
        );

      this.userService.comparePassword(payload.password, user.password);

      const token = sign(
        {
          userId: user._id,
          fullname: user.fullname,
          email: user.email,
          emailVerified: Boolean(user.emailVerifiedAt),
        },
        this.configService.get<string>('JWT_SECRET'),
        {
          expiresIn: '24h',
        },
      );

      return {
        emailVerified: Boolean(user.emailVerifiedAt),
        token,
        fullname: user.fullname,
        email: user.email,
      };
    } catch (error) {
      throw error;
    }
  }

  async requestEmailVerificationLink(email: string) {
    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user)
        throw new BadRequestException(`User with email '${email}' not found`);

      const sendEmail = await this.notificationService.sendEmailVerification(
        email,
        {
          fullname: user.fullname,
          email: user.email,
        },
      );

      return {
        status: sendEmail,
      };
    } catch (error) {
      throw error;
    }
  }
}
