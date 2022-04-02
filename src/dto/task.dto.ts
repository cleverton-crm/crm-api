import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
  owner: string;
  attachments: Map<string, string>;
  linkId: string;

  @ApiProperty({ example: 'Наименование задачи' })
  name: string;

  @ApiProperty({ example: 'Описание задачи' })
  description: string;

  @ApiProperty({ example: 'company' })
  linkType: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;
}
