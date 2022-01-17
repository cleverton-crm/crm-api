import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';

export class NewsDto implements Core.News.Schema {
  active: boolean;
  author: string;

  @ApiProperty()
  comments: Map<string, any>;
  @ApiProperty({ example: 'Новостной контент' })
  content: string;
  @ApiProperty({ example: 'Новость' })
  name: string;
  @ApiProperty()
  picture?: Map<string, any>;
}
export class NewsUpdateDto {
  active: boolean;
  author: string;
  @ApiProperty()
  comments: Map<string, any>;
  @ApiProperty({ example: 'Новостной контент' })
  content: string;
  @ApiProperty({ example: 'Новость' })
  name: string;
}
