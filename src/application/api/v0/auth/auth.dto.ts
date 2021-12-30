import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Match } from 'src/utils/decorators/match.decorator';

export class SignUpUserDto {
  @IsString()
  @ApiProperty({
    description: 'user full name',
    type: String,
    example: 'Your Name',
  })
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'user email',
    type: String,
    example: 'user@mail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    new RegExp(
      /^.*((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    ),
    {
      message: `Password must contains at least one lowercase character, one uppercase character, one digit character, one special characters`,
    },
  )
  @ApiProperty({
    type: String,
    description:
      'user password, must contains at least one lowercase character, one uppercase character, one digit character, one special characters',
    example: 'Testing234%',
  })
  password: string;

  @Match('password')
  @ApiProperty({
    type: String,
    description: 'password confirmation',
    example: 'Testing234%',
  })
  confirmPassword: string;
}

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'user email',
    type: String,
    example: 'user@mail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description:
      'user password, must contains at least one lowercase character, one uppercase character, one digit character, one special characters',
    example: 'Testing234%',
  })
  password: string;
}

export class SignInResponseDto {
  @ApiProperty({
    type: Boolean,
  })
  emailVerified: boolean;

  @ApiProperty({
    type: String,
    description: 'authenticated user email address',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'fullname',
  })
  fullname: string;

  @ApiProperty({
    type: String,
    description: 'access token',
  })
  token: string;
}

export class RequestEmailVerificationLinkDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'user@mail.com',
  })
  email: string;
}
