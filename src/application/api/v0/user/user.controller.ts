import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/application/middlewares/guards/auth.guard';
import { User } from 'src/application/schemas/user.schema';
import { Userinfo } from 'src/utils/decorators/userinfo.decorator';
import { Userinfo as UserinfoType } from 'src/utils/interfaces/userinfo.interface';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
