import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';
import { ClientContactDto } from './client.dto';
import { CompanyDto } from './company.dto';
import { ExampleCompany, ExampleFullCompany } from 'src/helpers/example-company';
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

export class LeadDto implements Core.Deals.Schema {
  owner: string;
  type: string;

  comments: DealComment;

  @ApiProperty({ example: 'Новый' })
  name: string;

  @ApiProperty({ example: 'Небольшое описание' })
  description?: string;

  @ApiProperty({ example: ['новый'] })
  tags?: Array<string>;

  @ApiProperty({ example: 10000 })
  price?: number;

  @ApiProperty({ example: 'Дизельное' })
  fuelType: string;

  @ApiProperty({ example: 10 })
  amountFuel: number;

  @ApiProperty({ example: '₽' })
  currency?: string;

  @ApiProperty()
  startDate?: Date;

  @ApiProperty()
  endDate?: Date;

  @ApiProperty()
  information?: Map<string, any>;

  @ApiProperty({ example: 'Холодный звонок' })
  source?: string;

  @ApiProperty({
    example: [ExampleClient, ExampleFullCompany],
    format: 'array',
  })
  contacts?: [ClientContactDto, CompanyDto];
}
