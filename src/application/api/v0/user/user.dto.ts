import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Match } from 'src/utils/decorators/match.decorator';

export class UpdateProfileDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  fullname: string;
}

export class ChangePasswordDto {
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
  password: string;

  @Match('password')
  confirmPassword: string;
}
