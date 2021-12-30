import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';

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

export class ClientDto implements Core.Client.Schema {
  @ApiProperty()
  attachments: Map<string, string>;
  @ApiProperty()
  birthDate: Date;
  @ApiProperty()
  comments: Map<string, string>;
  @ApiProperty()
  company: string | null;
  @ApiProperty()
  createData: Date;
  @ApiProperty()
  email: string;
  @ApiProperty()
  emailCompany: string;
  @ApiProperty()
  first: string;
  @ApiProperty()
  last: string;
  @ApiProperty()
  middle: string;
  @ApiProperty()
  object: 'client';
  @ApiProperty()
  owner: string;
  @ApiProperty()
  payerType: string | Core.Client.PayerType;
  @ApiProperty()
  permissions: Map<string, any>;
  @ApiProperty()
  phones: Array<string>;
  @ApiProperty()
  roleInCompany: string;
  @ApiProperty()
  socials: Map<string, string>;
  @ApiProperty()
  voices: Core.Client.SocialVoices;
  @ApiProperty()
  workPhone: string;
  @ApiProperty()
  active: boolean;
}
