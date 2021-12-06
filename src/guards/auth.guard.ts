import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Access denied');
      }
      let dataInsert;
      const user = this.jwtService.verify(token);
      if (dataInsert.access) {
        req.user = Object.assign(user, dataInsert);
        req.userID = dataInsert.id;
        return true;
      } else {
        throw new UnauthorizedException('Требуется авторизация в системе');
      }
    } catch (e) {
      throw new UnauthorizedException('Требуется авторизация в системе');
    }
  }
}
