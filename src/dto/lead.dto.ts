import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';
import { ClientContactDto } from './client.dto';
import { CompanyDto } from './company.dto';
import { ExampleCompany } from 'src/helpers/example-company';
import { ExampleClient } from '../helpers/example-client';

export class ObjectData {
  [key: string]: string;
}

export class DealHistory {
  @ApiProperty({
    example: 'string',
  })
  comments: Map<string, any>;
}

export class LeadDto implements Core.Deals.Schema {
  owner: string;
  type: string;

  @ApiProperty({ example: 'Новый лид' })
  name: string;

  @ApiProperty({ example: 'Небольшое описание лида' })
  description?: string;

  @ApiProperty({ example: ['Новый лид'] })
  tags?: Array<string>;

  @ApiProperty({ example: 10000 })
  price?: number;

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
    example: [ExampleClient, ExampleCompany],
    format: 'array',
  })
  contacts?: [ClientContactDto, CompanyDto];
}
