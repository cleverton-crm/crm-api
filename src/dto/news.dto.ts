import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';

export class NewsDto implements Core.News.Schema {
  active: boolean;
  author: string;

  @ApiProperty({ example: 'Новостной контент' })
  content: string;

  @ApiProperty({ example: 'Новость' })
  name: string;

  @ApiProperty()
  comments: Map<string, any>;

  @ApiProperty()
  picture?: Map<string, any>;
}
export class NewsUpdateDto {
  active: boolean;
  author: string;

  @ApiProperty({ example: 'Новостной контент' })
  content: string;

  @ApiProperty({ example: 'Новость' })
  name: string;
}

export class NewsCommentDto {
  @ApiProperty({ example: 'Комментарий 1' })
  comments: Map<string, any>;
}
