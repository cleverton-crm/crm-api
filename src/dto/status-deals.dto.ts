import { ApiProperty } from '@nestjs/swagger';

export class StatusDealsDto {
  active: boolean;
  locked: boolean;
  public: boolean;
  owner: string;
  priority: number;

  @ApiProperty({ example: 'Новая сделка' })
  name: string;

  @ApiProperty({ example: 'Описание статуса' })
  description: string;

  @ApiProperty({ example: '#F0B13A' })
  color: string;
}
