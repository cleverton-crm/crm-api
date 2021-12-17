/*
 * Copyright (c) 2021-2021.
 * Talk Time
 * Senior Backend Developer: Alexander Hunter <icehuntmen@gmail.com>
 * Middle Backend Developer: Vasily Gymenyuk <vasyagymenyuk@yandex.ru>
 *
 * NOTICE: DO NOT CHANGE WITHOUT REQUEST
 */

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { I18nService } from 'nestjs-i18n';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger: Logger;
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {
    this.logger = new Logger('RolesGuard');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      if (authHeader === undefined) {
        throw new Error(' - Authorization token not found!');
      }
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Access denied for this user role');
      }

      const user = this.jwtService.verify(token);
      req.user = user;
      return user.roles.some((role) => requiredRoles.includes(role.name));
    } catch (e) {
      const messageError =
        'Access denied. Пожалуйста обратитесь в службу поддержки';
      this.logger.error(messageError + e.message);
      throw new ForbiddenException(messageError);
    }
  }
}
