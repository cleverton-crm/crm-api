import { Core } from 'crm-core';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ClientContactArray, ClientContactDto, ClientDto } from './client.dto';
import { CompanyDto } from './company.dto';
import { ExampleCompany } from 'src/helpers/example-company';

export class LeadDto implements Core.Leads.Schema {
    active: boolean;
    owner: string;
    author: string;
    permissions: Map<string, any>;
    activity: Map<string, any>;
    object: 'task';
    type: 'lead';

    company: string;

    @ApiProperty({ example: 'Новый лид' })
    name: string;
    @ApiProperty({ example: 'Небольшое описание лида' })
    description: string;
    @ApiProperty({ example: 'Новый запрос' })
    status: string | Core.Leads.LeadStatus;
    @ApiProperty({ example: 'Новый лид' })
    tags: Array<string>;

    @ApiProperty({ example: 'Новый лид' })
    attachments: Map<string, any>;
    @ApiProperty({ example: 10000 })
    price: number;
    @ApiProperty({ example: '₽' })
    currency: string;
    @ApiProperty()
    startDate: Date;
    @ApiProperty()
    endDate: Date;
    @ApiProperty()
    information: Map<string, any>;
    @ApiProperty()
    source: string;
    @ApiProperty()
    client: string;
    @ApiProperty({
        example: [{ object: 'client', firstname: 'Test' }, ExampleCompany],
        format: 'array',
    })
    contacts: [ClientContactDto, CompanyDto];
}
