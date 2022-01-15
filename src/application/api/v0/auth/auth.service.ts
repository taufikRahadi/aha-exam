import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from 'src/application/schemas/user.schema';
import { UserService } from '../user/user.service';
import { SignInResponseDto, SignInUserDto } from './auth.dto';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from '../notification/notification.service';
import { OAuth2Client } from 'google-auth-library';
import { GoogleLogin } from 'src/utils/interfaces/google-login.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  private oauthClient = new OAuth2Client({
    clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
  });

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

  async googleLogin(idToken: string) {
    try {
      const data = await this.oauthClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const userData: GoogleLogin = data.getPayload();

      const user = await this.userService.findUserByEmail(userData.email);

      if (!user) {
        const newUser = await this.userService.createUser({
          email: userData.email,
          fullname: userData.name,
          signUpMethod: 'google-auth',
          emailVerifiedAt: new Date(),
          password: `${userData.email}-(google-auth)`,
        });
        console.log(newUser);

        const token = sign(
          {
            userId: newUser.id,
            fullname: newUser.fullname,
            email: newUser.email,
            emailVerified: Boolean(newUser.emailVerifiedAt),
          },
          this.configService.get<string>('JWT_SECRET'),
          {
            expiresIn: '24h',
          },
        );

        return {
          emailVerified: Boolean(newUser.emailVerifiedAt),
          token,
          fullname: newUser.fullname,
          email: newUser.email,
        };
      } else {
        if (user.signUpMethod === 'email-password') {
          throw new UnprocessableEntityException(
            `Please Login With Your Email and Password`,
          );
        }

        const token = sign(
          {
            userId: user.id,
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
      }
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
      else if (!Boolean(user.emailVerifiedAt))
        throw new BadRequestException('User Account Not Verified');
      else if (user.signUpMethod !== 'email-password')
        throw new BadRequestException('Please Login With Your Google Account');

      this.userService.comparePassword(payload.password, user.password);

      const token = sign(
        {
          userId: user.id,
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

  async verifyEmail(token: string) {
    try {
      const verifyToken: any = verify(token, 'Aha-Email-Verification');
      if (!verifyToken) throw new UnprocessableEntityException(`Invalid Link`);

      const user = await this.userService.findUserByEmail(verifyToken.email);
      await this.userService.update(user.id, {
        emailVerifiedAt: new Date(),
      });

      return {
        status: true,
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
