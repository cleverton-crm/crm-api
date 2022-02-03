import { ApiProperty } from '@nestjs/swagger';

export class StatusDealsDto {
  active: boolean;
  locked: boolean;
  public: boolean;
  owner: string;

  @ApiProperty({ example: 'Новая сделка' })
  name: string;

  @ApiProperty({ example: 1 })
  priority: number;

  @ApiProperty({ example: 'Описание статуса' })
  description: string;

  @ApiProperty()
  color: string;
}
