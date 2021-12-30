import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { headers } = request;

    if (!headers.authorization) throw new UnauthorizedException(`Unauthorized`);

    const [type, token] = headers.authorization.split(' ');

    if (type !== 'Bearer' || !token)
      throw new ForbiddenException(`Invalid Session`);

    const verifyToken = verify(
      token,
      this.configService.get<string>('JWT_SECRET'),
    );

    if (!verifyToken) throw new ForbiddenException(`Invalid Session`);

    request['userinfo'] = verifyToken;

    return true;
  }
}
