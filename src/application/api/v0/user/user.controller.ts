import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/application/middlewares/guards/auth.guard';
import { User } from 'src/application/schemas/user.schema';
import { Userinfo } from 'src/utils/decorators/userinfo.decorator';
import { Userinfo as UserinfoType } from 'src/utils/interfaces/userinfo.interface';
import { StatusDto } from '../auth/auth.dto';
import { ChangePasswordDto, UpdateProfileDto } from './user.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusDto,
  })
  async updateProfile(
    @Body() payload: UpdateProfileDto,
    @Userinfo() { userId }: UserinfoType,
  ) {
    await this.userService.update(userId, payload);
    return { status: true };
  }

  @Put('/reset-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user success change password',
    type: StatusDto,
  })
  async resetPassword(
    @Body() { password }: ChangePasswordDto,
    @Userinfo() { userId }: UserinfoType,
  ) {
    await this.userService.update(userId, {
      password: password,
    });

    return { status: true };
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'fetch current login user profile',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized request',
  })
  async getMyProfile(@Userinfo() userinfo: UserinfoType) {
    return this.userService.findUserByEmail(userinfo.email, false);
  }
}
