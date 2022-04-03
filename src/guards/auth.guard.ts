import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { SendAndResponseData } from '../helpers/global';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    let messageAccess = 'Требуется авторизация в системе';
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Access denied');
      }
      let filterGuard = {};
      const user = this.jwtService.verify(token);
      if (user.roles[0].name === 'Manager') {
        filterGuard = { owner: user.userID };
      }

      const userData = await SendAndResponseData(this.userService, 'user:email', user.email);
      console.log(user);
      console.log(userData);
      if (userData === null || userData === undefined) {
        messageAccess = messageAccess + '! Не верный ключ авторизации!';
        throw new UnauthorizedException(messageAccess);
      } else {
        if (userData?.data.accessToken !== token) {
          messageAccess =
            messageAccess +
            '! Возможно, кто то вошел вашим аккаунтом с другово оборудования! Пожалуйста смените пароль!';
          throw new UnauthorizedException(messageAccess);
        }
      }

      req.user = {
        id: user.userID,
        email: user.email,
        access: token,
        filterQuery: filterGuard,
      };
      return true;
    } catch (e) {
      // throw new HttpException({ statusCode: e.status, message:  }, HttpStatus.UNAUTHORIZED);
      throw new UnauthorizedException(messageAccess);
    }
  }
}
