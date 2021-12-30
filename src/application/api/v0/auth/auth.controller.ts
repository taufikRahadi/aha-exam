import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { User } from 'src/application/schemas/user.schema';
import {
  RequestEmailVerificationLinkDto,
  SignInResponseDto,
  SignInUserDto,
  SignUpUserDto,
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
