import { Core } from 'crm-core';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ClientContactDto } from './client.dto';
import { CompanyDto } from './company.dto';
import { ExampleFullCompany } from 'src/helpers/example-company';
import { ExampleClient } from '../helpers/example-client';

export class ObjectData {
  [key: string]: string;
}

export class DealComment {
  @ApiProperty({
    example: 'string',
  })
  comments: string;
}

export class DealDto implements Core.Deals.Schema {
  owner: string;
  type: string;
  company: string;
  client: string;

  comments: DealComment;

  @ApiProperty({ example: 'Новая сделка' })
  name: string;

  @ApiProperty({ example: 'Описание сделки' })
  description?: string;

  @ApiProperty({ example: ['новая', 'сделка'] })
  tags?: Array<string>;

  @ApiProperty({ example: 15000 })
  price?: number;

  @ApiProperty({ example: 'Дизельное' })
  fuelType: string;

  @ApiProperty({ example: 10 })
  amountFuel: number;

  @ApiProperty({ example: 'RUB' })
  currency?: string;

  @ApiProperty()
  startDate?: Date;

  @ApiProperty()
  endDate?: Date;

  @ApiProperty()
  information?: Map<string, any>;

  @ApiProperty({ example: 'Холодный звонок' })
  source?: string;

  contacts?: [ClientContactDto, CompanyDto];
}
