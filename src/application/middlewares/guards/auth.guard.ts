import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { UserService } from 'src/application/api/v0/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { headers } = request;

    if (!headers.authorization) throw new UnauthorizedException(`Unauthorized`);

    const [type, token] = headers.authorization.split(' ');

    if (type !== 'Bearer' || !token)
      throw new ForbiddenException(`Invalid Session`);

    const verifyToken: any = verify(
      token,
      this.configService.get<string>('JWT_SECRET'),
    );

    if (!verifyToken) throw new ForbiddenException(`Invalid Session`);

    if (!(await this.userService.checkEmailVerified(verifyToken.userId)))
      throw new ForbiddenException(`Your account is not verified`);

    request['userinfo'] = verifyToken;

    return true;
  }
}
