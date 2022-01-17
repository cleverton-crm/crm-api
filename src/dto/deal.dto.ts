import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleCompany } from '../helpers/example-company';

export class DealHistory {
  @ApiProperty({
    example: 'string',
  })
  comments: Map<string, any>;
}

export class DealDto implements Core.Deals.Schema {
  author: string;
  active: boolean;
  permissions: Map<string, any>;
  owner: string;

  @ApiProperty({ example: 'Продажа топлива #1' })
  name: string;

  @ApiProperty({ example: 10 })
  fuelAmount: number;

  @ApiProperty({ example: 'Дизельное' })
  fuelType: string;

  @ApiProperty({ example: ExampleCompany.data.opf.short })
  ownership: string | Core.Company.Ownership;

  @ApiProperty({ example: 'Звонок' })
  source: string;

  @ApiProperty({ example: 'Новая' })
  status: string | Core.Deals.Status;

  @ApiProperty({ example: 30000 })
  sum: number;

  @ApiProperty({ example: ['дизельное', 'топливо', 'продажа'] })
  tags: Array<string>;

  @ApiProperty({ example: 'Иванов Алексей Владимирович' })
  fullname: string;

  history: Map<string, any>;
}
