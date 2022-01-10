import {
  applyDecorators,
  HttpStatus,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ResponseSuccessDto, ResponseUnauthorizedDto } from '../dto';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiResponse({
      description: 'Данные',
      status: HttpStatus.OK,
      type: ResponseSuccessDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      status: HttpStatus.UNAUTHORIZED,
      type: ResponseUnauthorizedDto,
    }),
  );
}
