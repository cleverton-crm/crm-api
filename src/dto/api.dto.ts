import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

/** Положительный ответ сервера с данными */
export class ResponseSuccessDto {
  @ApiProperty({ default: HttpStatus.OK })
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: string;
}

export class ResponseNotFoundDto {
  @ApiProperty({ default: HttpStatus.NOT_FOUND })
  statusCode: number;
  @ApiProperty()
  message: string | string[];
  @ApiProperty({ default: 'Not Found' })
  error: string;
}

export class ResponseBadRequestDto {
  @ApiProperty({ default: HttpStatus.BAD_REQUEST })
  statusCode: number;
  @ApiProperty()
  message: string | string[];
  @ApiProperty({ default: 'Not Found' })
  error: string;
}

export class ResponseUnauthorizedDto {
  @ApiProperty({ default: HttpStatus.UNAUTHORIZED })
  statusCode: number;
  @ApiProperty()
  message: string | string[];
  @ApiProperty({ default: 'Unauthorized' })
  error: string;
}

export class ResponseForbiddenDto {
  @ApiProperty({ default: HttpStatus.FORBIDDEN })
  statusCode: number;
  @ApiProperty()
  message: string | string[];
  @ApiProperty({ default: 'Forbidden' })
  error: string;
}
