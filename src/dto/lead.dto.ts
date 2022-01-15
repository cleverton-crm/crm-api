import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleCompany } from '../helpers/example-company';

export class LeadPassportDto implements Core.Leads.Passport {
  @ApiProperty()
  dateOfIssue: Date;
  @ApiProperty()
  issuedBy: string;
  @ApiProperty()
  passportSeriesAndNumber: string;
}

export class LeadLicensesDto implements Core.Leads.Licenses {
  @ApiProperty()
  adr: string;
  @ApiProperty()
  categories: string[];
  @ApiProperty()
  validity: Date;
}

export class LeadDto implements Core.Leads.Schema {
  active: boolean;
  owner: string;
  permissions: string;

  @ApiProperty({ example: 'Лид №1' })
  name: string;

  @ApiProperty({ example: ExampleCompany.data.opf.short })
  payerType: string | Core.Company.Ownership;

  @ApiProperty({ example: 'Буров Григорий Глебович' })
  fullname: string;

  @ApiProperty({ example: 'Руководитель IT отдела' })
  position: string;

  @ApiProperty({ example: 'Руководитель' })
  companyRole: string | Core.Leads.CompanyRole;

  @ApiProperty({ example: '+79160000000' })
  workPhone?: string;

  @ApiProperty({ example: '+79165311290' })
  mobilePhone?: string;

  @ApiProperty({ example: 'Доставка' })
  delivery: string;

  @ApiProperty({ example: 'Сайт' })
  source: string;

  @ApiProperty({ example: '+79995641234' })
  mobilePhone2?: string;

  @ApiProperty({ example: '+79993641297' })
  mobilePhone3?: string;

  @ApiProperty({ example: 'personal@example.com' })
  personalEmail?: string;

  @ApiProperty({ example: 'smth@example.com' })
  corporateEmail?: string;

  @ApiProperty({ example: 'burov313' })
  skype?: string;

  @ApiProperty({ example: new Date() })
  birthDate: Date;

  @ApiProperty()
  comments?: string;

  @ApiProperty({ type: LeadPassportDto })
  passport: LeadPassportDto;

  @ApiProperty({ type: LeadLicensesDto })
  licenses: LeadLicensesDto;
}
