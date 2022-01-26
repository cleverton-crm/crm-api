import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';

export class LeadDto implements Core.Leads.Schema {
  active: boolean;
  owner: string;
  author: string;
  permissions: Map<string, any>;

  name: string;
  activity: Map<string, any>;

  client: Core.Client.Schema;
  description: string;
  object: 'task';
  status: string;
  tags: Array<string>;
  type: string | 'leads' | 'deals';
}
