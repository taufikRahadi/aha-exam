import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { User } from 'src/application/schemas/user.schema';
import {
  GoogleLoginDto,
  RequestEmailVerificationLinkDto,
  SignInResponseDto,
  SignInUserDto,
  SignUpUserDto,
  StatusDto,
  VerifyEmailDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'user created',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'validation error',
  })
  async registerUser(@Body() payload: SignUpUserDto): Promise<User> {
    return this.authService.signUpUser(payload);
  }

  @Post('/google')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'google login success, returns access token',
    type: SignInResponseDto,
  })
  async googleLogin(@Body() { idToken }: GoogleLoginDto) {
    return this.authService.googleLogin(idToken);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'sign in success and returns access token',
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'validation error',
  })
  async signIn(@Body() payload: SignInUserDto): Promise<SignInResponseDto> {
    return this.authService.signInUser(payload);
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'account verified',
    type: StatusDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid Token Link',
  })
  async verifyEmail(@Body() { token }: VerifyEmailDto) {
    return this.authService.verifyEmail(token);
  }

  @Post('/email-verification')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'send email verification link',
  })
  async requestEmailVerificationLink(
    @Body() { email }: RequestEmailVerificationLinkDto,
  ) {
    return this.authService.requestEmailVerificationLink(email);
  }
}
