import {Company} from 'crm-core'
import {ApiProperty} from "@nestjs/swagger";

export class CompanyBankDto  implements Company.Bank{
    bank: string;
    bankAddress: string;
    bik: string;
    correspondent: string;
    payment: string;

}
export class CompanyRequisitesNameDto implements Company.Requisites.Name{
    full: string;
    full_with_opf: string;
    latin: string | null;
    short: string;
    short_with_opf: string;

}
export class CompanyRequisitesInfoDto implements Company.Requisites.Info{
    area: null;
    area_fias_id: null;
    area_kladr_id: null;
    area_type: null;
    area_type_full: null;
    area_with_type: null;
    beltway_distance: string | null;
    beltway_hit: string;
    block: string | null;
    block_type: string | null;
    block_type_full: string | null;
    capital_marker: string;
    city: string;
    city_area: string;
    city_district: string;
    city_district_fias_id: string | null;
    city_district_kladr_id: string | null;
    city_district_type: string;
    city_district_type_full: string;
    city_district_with_type: string;
    city_fias_id: string;
    city_kladr_id: string;
    city_type: string;
    city_type_full: string;
    city_with_type: string;
    country: string;
    country_iso_code: string;
    entrance: string | null;
    federal_district: string;
    fias_actuality_state: string;
    fias_code: string;
    fias_id: string;
    fias_level: string;
    flat: string | null;
    flat_area: string | null;
    flat_cadnum: string | null;
    flat_fias_id: string | null;
    flat_price: string | null;
    flat_type: string | null;
    flat_type_full: string | null;
    floor: string | null;
    geo_lat: string;
    geo_lon: string;
    geoname_id: string;
    history_values: string | null;
    house: string;
    house_cadnum: string | null;
    house_fias_id: string;
    house_kladr_id: string;
    house_type: string;
    house_type_full: string;
    kladr_id: string;
    metro: Array<any>;
    okato: string;
    oktmo: string;
    postal_box: string | null;
    postal_code: string;
    qc: string;
    qc_complete: string | null;
    qc_geo: string;
    qc_house: string | null;
    region: string;
    region_fias_id: string;
    region_iso_code: string;
    region_kladr_id: string;
    region_type: string;
    region_type_full: string;
    region_with_type: string;
    settlement: string | null;
    settlement_fias_id: string | null;
    settlement_kladr_id: string | null;
    settlement_type: string | null;
    settlement_type_full: string | null;
    settlement_with_type: string | null;
    source: string;
    square_meter_price: string | null;
    street: string;
    street_fias_id: string;
    street_kladr_id: string;
    street_type: string;
    street_type_full: string;
    street_with_type: string;
    tax_office: string;
    tax_office_legal: string;
    timezone: string;
    unparsed_parts: string | null;

}

export class CompanyRequisitesAddressesDto implements  Company.Requisites.Address{
    @ApiProperty()
    data: CompanyRequisitesInfoDto;
    @ApiProperty()
    unrestricted_value: string;
    @ApiProperty()
    value: string;

}

export class CompanyManagementDto implements Company.Management{
    @ApiProperty()
    disqualified: string | null;
    @ApiProperty()
    name: string;
    @ApiProperty()
    post: string;
}

export class CompanyRequisitesOPFDto implements Company.Requisites.OPF{
    @ApiProperty()
    code: string;
    @ApiProperty()
    full: string;
    @ApiProperty()
    short: string;
    @ApiProperty()
    type: string;

}
export class CompanyRequisitesStateDto implements Company.Requisites.State{
    @ApiProperty()
    actuality_date: number;
    @ApiProperty()
    code: string | number | null;
    @ApiProperty()
    liquidation_date: number | Date | null;
    @ApiProperty()
    registration_date: number;
    @ApiProperty()
    status: string;

}

export class CompanyRequisitesUsDto implements Company.Requisites.CompanyUs{
    @ApiProperty()
    address: CompanyRequisitesAddressesDto;
    @ApiProperty()
    authorities: string | null;
    @ApiProperty()
    branch_count: number;
    @ApiProperty()
    branch_type: string;
    @ApiProperty()
    capital: string | null;
    @ApiProperty()
    documents: string | null;
    @ApiProperty()
    emails: string | null;
    @ApiProperty()
    employee_count: number | string | null;
    @ApiProperty()
    finance: string | null;
    @ApiProperty()
    founders: string | null;
    @ApiProperty()
    hid: string | null;
    @ApiProperty()
    inn: string;
    @ApiProperty()
    kpp: string;
    @ApiProperty()
    licenses: string | null;
    @ApiProperty({type:CompanyManagementDto})
    management: CompanyManagementDto;
    @ApiProperty()
    managers: string | null;
    @ApiProperty({type: CompanyRequisitesNameDto})
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
    okveds: string | null;
    @ApiProperty({type: CompanyRequisitesOPFDto})
    opf: CompanyRequisitesOPFDto;
    @ApiProperty()
    phones: string | null;
    @ApiProperty()
    predecessors: string | null;
    @ApiProperty()
    qc: string | null;
    @ApiProperty()
    source: string | null;
    @ApiProperty({type:CompanyRequisitesStateDto})
    state: CompanyRequisitesStateDto;
    @ApiProperty()
    successors: string | null;
    @ApiProperty()
    type: string;

}

export class CompanyRequisitesDto implements Company.Requisites.CompanyName {
    @ApiProperty()
    companyId: string;
    @ApiProperty({type: CompanyRequisitesUsDto})
    data: CompanyRequisitesUsDto;
    @ApiProperty()
    unrestricted_value: string;
    @ApiProperty()
    value: string;

}

export class CompanyDto implements Company.About {
    @ApiProperty({type: CompanyBankDto})
    bankData: CompanyBankDto;
    @ApiProperty()
    client: Array<string>;
    @ApiProperty()
    companyLocation: string;
    @ApiProperty()
    employeesCount: number;
    @ApiProperty()
    factLocation: string;
    @ApiProperty()
    fax: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    object: "company";
    @ApiProperty()
    owner: string;
    @ApiProperty()
    ownership: string | Company.Ownership;
    @ApiProperty()
    permissions: string;
    @ApiProperty()
    phoneNumber: string;
    @ApiProperty()
    phones: Array<string>;
    @ApiProperty()
    postLocation: string;
    @ApiProperty({type:CompanyRequisitesDto})
    requisites: CompanyRequisitesDto;
    @ApiProperty()
    source: string;
    @ApiProperty()
    tags: Array<string>;
    @ApiProperty()
    web: string;

}
