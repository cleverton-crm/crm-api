import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';
import { PassportDto } from './profile.dto';
import { CompanyDto } from './company.dto';

export class ClientCompanySocialVoicesDto implements Core.Client.SocialVoices {
  discord: string | null;
  fb: string | null;
  skype: string | null;
  slack: string | null;
  telegram: string | null;
  viber: string | null;
  vk: string | null;
  whatsapp: string | null;
}

export class LicensesDto {
  @ApiProperty()
  adr: string;
  @ApiProperty()
  categories: string[];
  @ApiProperty()
  validity: Date;
}

export class ClientDto implements Core.Client.Schema {
  object: string;
  attachments: Map<string, string>;
  company: string | null;
  owner: string;
  comments: Map<string, string>;
  permissions: Map<string, any>;
  active: boolean;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty({ default: new Date() })
  createData: Date;

  @ApiProperty({ example: 'alex@company.com' })
  email: string;

  @ApiProperty({ example: 'info@company.com' })
  emailCompany: string;

  @ApiProperty({ example: 'Сергей' })
  first: string;

  @ApiProperty({ example: 'Тесткович' })
  last: string;

  @ApiProperty({ example: 'Сергеевич' })
  middle: string;

  @ApiProperty({ example: 'entity' })
  payerType: string | Core.Client.PayerType;

  @ApiProperty({ example: ['+79161232345'] })
  phones: Array<string>;

  @ApiProperty({ example: 'Начальник отдела закупок' })
  roleInCompany: string;

  @ApiProperty()
  socials: Map<string, string>;

  @ApiProperty()
  voices: Core.Client.SocialVoices;

  @ApiProperty()
  workPhone: string;

  @ApiProperty()
  passport: PassportDto;

  @ApiProperty()
  licenses: LicensesDto;
  avatar: Map<string, any>;
}

export class ClientContactDto extends ClientDto {
  @ApiProperty({ default: 'client' })
  object: string;
}

export type ClientContactArray = ClientContactDto | CompanyDto;
