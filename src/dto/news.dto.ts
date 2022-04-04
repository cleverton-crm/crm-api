import { ApiProperty } from '@nestjs/swagger';

export class NewsDto {
  owner: string;

  @ApiProperty({ example: 'Новостной контент' })
  content: string;

  @ApiProperty({ example: 'Новость' })
  name: string;
}
export class NewsUpdateDto {
  @ApiProperty({ example: 'Новостной контент' })
  content: string;

  @ApiProperty({ example: 'Новость' })
  name: string;
}

export class NewsCommentDto {
  @ApiProperty({ example: 'Текст комментария' })
  comments: Map<string, any>;
}
