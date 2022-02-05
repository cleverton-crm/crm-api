import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleCompany } from 'src/helpers/example-company';

export class CompanyBankDto implements Core.Company.Bank {
  @ApiProperty()
  bank: string;
  @ApiProperty()
  bankAddress: string;
  @ApiProperty()
  bik: string;
  @ApiProperty()
  correspondent: string;
  @ApiProperty()
  payment: string;
}
export class CompanyRequisitesNameDto implements Core.Company.Requisites.Name {
  @ApiProperty()
  full: string;
  @ApiProperty()
  full_with_opf: string;
  @ApiProperty()
  latin: string | null;
  @ApiProperty()
  short: string;
  @ApiProperty()
  short_with_opf: string;
}
export class CompanyRequisitesInfoDto implements Core.Company.Requisites.Info {
  @ApiProperty()
  area: string | null;
  @ApiProperty()
  area_fias_id: string | null;
  @ApiProperty()
  area_kladr_id: string | null;
  @ApiProperty()
  area_type: string | null;
  @ApiProperty()
  area_type_full: string | null;
  @ApiProperty()
  area_with_type: string | null;
  @ApiProperty()
  beltway_distance: string | null;
  @ApiProperty()
  beltway_hit: string;
  @ApiProperty()
  block: string | null;
  @ApiProperty()
  block_type: string | null;
  @ApiProperty()
  block_type_full: string | null;
  @ApiProperty()
  capital_marker: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  city_area: string;
  @ApiProperty()
  city_district: string;
  @ApiProperty()
  city_district_fias_id: string | null;
  @ApiProperty()
  city_district_kladr_id: string | null;
  @ApiProperty()
  city_district_type: string;
  @ApiProperty()
  city_district_type_full: string;
  @ApiProperty()
  city_district_with_type: string;
  @ApiProperty()
  city_fias_id: string;
  @ApiProperty()
  city_kladr_id: string;
  @ApiProperty()
  city_type: string;
  @ApiProperty()
  city_type_full: string;
  @ApiProperty()
  city_with_type: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  country_iso_code: string;
  @ApiProperty()
  entrance: string | null;
  @ApiProperty()
  federal_district: string;
  @ApiProperty()
  fias_actuality_state: string;
  @ApiProperty()
  fias_code: string;
  @ApiProperty()
  fias_id: string;
  @ApiProperty()
  fias_level: string;
  @ApiProperty()
  flat: string | null;
  @ApiProperty()
  flat_area: string | null;
  @ApiProperty()
  flat_cadnum: string | null;
  @ApiProperty()
  flat_fias_id: string | null;
  @ApiProperty()
  flat_price: string | null;
  @ApiProperty()
  flat_type: string | null;
  @ApiProperty()
  flat_type_full: string | null;
  @ApiProperty()
  floor: string | null;
  @ApiProperty()
  geo_lat: string;
  @ApiProperty()
  geo_lon: string;
  @ApiProperty()
  geoname_id: string;
  @ApiProperty()
  history_values: string | null;
  @ApiProperty()
  house: string;
  @ApiProperty()
  house_cadnum: string | null;
  @ApiProperty()
  house_fias_id: string;
  @ApiProperty()
  house_kladr_id: string;
  @ApiProperty()
  house_type: string;
  @ApiProperty()
  house_type_full: string;
  @ApiProperty()
  kladr_id: string;
  @ApiProperty()
  metro: Array<any>;
  @ApiProperty()
  okato: string;
  @ApiProperty()
  oktmo: string;
  @ApiProperty()
  postal_box: string | null;
  @ApiProperty()
  postal_code: string;
  @ApiProperty()
  qc: string;
  @ApiProperty()
  qc_complete: string;
  @ApiProperty()
  qc_geo: string;
  @ApiProperty()
  qc_house: string;
  @ApiProperty()
  region: string;
  @ApiProperty()
  region_fias_id: string;
  @ApiProperty()
  region_iso_code: string;
  @ApiProperty()
  region_kladr_id: string;
  @ApiProperty()
  region_type: string;
  @ApiProperty()
  region_type_full: string;
  @ApiProperty()
  region_with_type: string;
  @ApiProperty()
  settlement: string;
  @ApiProperty()
  settlement_fias_id: string;
  @ApiProperty()
  settlement_kladr_id: string;
  @ApiProperty()
  settlement_type: string;
  @ApiProperty()
  settlement_type_full: string;
  @ApiProperty()
  settlement_with_type: string;
  @ApiProperty()
  source: string;
  @ApiProperty()
  square_meter_price: string;
  @ApiProperty()
  street: string;
  @ApiProperty()
  street_fias_id: string;
  @ApiProperty()
  street_kladr_id: string;
  @ApiProperty()
  street_type: string;
  @ApiProperty()
  street_type_full: string;
  @ApiProperty()
  street_with_type: string;
  @ApiProperty()
  tax_office: string;
  @ApiProperty()
  tax_office_legal: string;
  @ApiProperty()
  timezone: string;
  @ApiProperty()
  unparsed_parts: string;
}

export class CompanyRequisitesAddressesDto implements Core.Company.Requisites.Address {
  @ApiProperty()
  data: CompanyRequisitesInfoDto;
  @ApiProperty()
  unrestricted_value: string;
  @ApiProperty()
  value: string;
}

export class CompanyManagementDto implements Core.Company.Management {
  @ApiProperty()
  disqualified: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  post: string;
}

export class CompanyRequisitesOPFDto implements Core.Company.Requisites.OPF {
  @ApiProperty()
  code: string;
  @ApiProperty()
  full: string;
  @ApiProperty()
  short: string;
  @ApiProperty()
  type: string;
}
export class CompanyRequisitesStateDto implements Core.Company.Requisites.State {
  @ApiProperty()
  actuality_date: number;
  @ApiProperty()
  code: string;
  @ApiProperty()
  liquidation_date: number;
  @ApiProperty()
  registration_date: number;
  @ApiProperty()
  status: string;
}
export class CompanyRequisitesFinance implements Core.Company.Requisites.Finance {
  @ApiProperty()
  tax_system?: string;
  @ApiProperty()
  income?: string;
  @ApiProperty()
  expense?: string;
  @ApiProperty()
  debt?: string;
  @ApiProperty()
  penalty?: string;
  @ApiProperty()
  year?: string;
}

export class CompanyRequisitesUsDto implements Core.Company.Requisites.CompanyUs {
  @ApiProperty()
  address: CompanyRequisitesAddressesDto;
  @ApiProperty()
  authorities: string;
  @ApiProperty()
  branch_count: number;
  @ApiProperty()
  branch_type: string;
  @ApiProperty()
  capital: string;
  @ApiProperty()
  documents: string;
  @ApiProperty()
  emails: string;
  @ApiProperty()
  employee_count: number;
  @ApiProperty()
  finance: CompanyRequisitesFinance;
  @ApiProperty()
  founders: string;
  @ApiProperty()
  hid: string;
  @ApiProperty()
  inn: string;
  @ApiProperty()
  kpp: string;
  @ApiProperty()
  licenses: string;
  @ApiProperty({ type: CompanyManagementDto })
  management: CompanyManagementDto;
  @ApiProperty()
  managers: string;
  @ApiProperty({ type: CompanyRequisitesNameDto })
  name: CompanyRequisitesNameDto;
  @ApiProperty()
  ogrn: string;
  @ApiProperty()
  ogrn_date: number;
  @ApiProperty()
  okato: string;
  @ApiProperty()
  okfs: string;
  @ApiProperty()
  okogu: string;
  @ApiProperty()
  okpo: string;
  @ApiProperty()
  oktmo: string;
  @ApiProperty()
  okved: string;
  @ApiProperty()
  okved_type: string;
  @ApiProperty()
  okveds: string;
  @ApiProperty({ type: CompanyRequisitesOPFDto })
  opf: CompanyRequisitesOPFDto;
  @ApiProperty()
  phones: string;
  @ApiProperty()
  predecessors: string;
  @ApiProperty()
  qc: string;
  @ApiProperty()
  source: string;
  @ApiProperty({ type: CompanyRequisitesStateDto })
  state: CompanyRequisitesStateDto;
  @ApiProperty()
  successors: string;
  @ApiProperty()
  type: string;
}

export class CompanyRequisitesDto implements Core.Company.Requisites.CompanyName {
  @ApiProperty()
  companyId: string;
  @ApiProperty({ type: CompanyRequisitesUsDto })
  data: CompanyRequisitesUsDto;
  @ApiProperty()
  unrestricted_value: string;
  @ApiProperty()
  value: string;
}

export class CompanyDto implements Core.Company.Schema {
  partner: Record<string, any>;
  park: Record<string, any>;
  holding: Record<string, any>;
  owner: string;
  clients: string[];
  @ApiProperty({ type: CompanyBankDto })
  bank: CompanyBankDto;
  @ApiProperty()
  client: Array<string>;
  @ApiProperty({ example: ExampleCompany.data.address.value })
  companyLocation: string;
  @ApiProperty()
  employeesCount: number;
  @ApiProperty({ example: ExampleCompany.data.address.value })
  factLocation: string;
  @ApiProperty()
  fax: string;
  @ApiProperty({ example: ExampleCompany.value })
  name: string;
  inn: string;
  @ApiProperty()
  object: 'company';

  @ApiProperty({ example: ExampleCompany.data.opf.short })
  ownership: string | Core.Company.Ownership;
  @ApiProperty()
  permissions: Map<string, any>;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  phones: Array<string>;
  @ApiProperty({ example: ExampleCompany.data.address.value })
  postLocation: string;
  @ApiProperty({ type: CompanyRequisitesDto, example: ExampleCompany })
  requisites: CompanyRequisitesDto;
  @ApiProperty()
  source: string;
  @ApiProperty()
  tags: Array<string>;
  @ApiProperty()
  web: string;
  active: boolean;
}
