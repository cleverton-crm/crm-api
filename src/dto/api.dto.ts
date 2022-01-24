import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {
  IResponseDataRecords,
  IResponseOptionsRecords,
} from '../interfaces/api.interface';

/** Положительный ответ сервера с данными */
export class ResponseSuccessDto {
  @ApiProperty({ default: HttpStatus.OK })
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: string | any[];
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
  @ApiProperty({ default: 'Требуется авторизация' })
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

export class ResponseOptionsDto implements IResponseOptionsRecords {
  @ApiProperty({ description: 'Текущая страница' })
  currentPage: number;
  @ApiProperty({ description: 'Можно ли смотреть следующую страницу' })
  hasNextPage: boolean;
  @ApiProperty({ description: 'Можно ли смотреть предыдущую страницу' })
  hasPrevPage: boolean;
  @ApiProperty({ description: 'Следующая страница - номер' })
  next: number | null;
  @ApiProperty({ description: 'Предыдущая страница - номер' })
  prev: number | null;
  @ApiProperty({ description: 'Всего страниц' })
  pageCount: number;
  @ApiProperty({ description: 'Пред' })
  perPage: number;
  @ApiProperty({ description: 'Следующая' })
  slNo: number;
  @ApiProperty({ description: 'Всего записей' })
  totalPages: number;
}

export class ResponseRecordsDataDto implements IResponseDataRecords {
  @ApiProperty({ description: 'Стутус страницы' })
  statusCode: number;
  @ApiProperty({ description: 'Описание страницы' })
  message: string;
  @ApiProperty({ description: 'Параметры страниц' })
  records: ResponseOptionsDto;
  @ApiProperty({
    description:
      'Массив данных, для каждой колекции свои. ' + 'Смотрите схему коллекции',
    example: [{}, '...'],
  })
  data: [];
}
