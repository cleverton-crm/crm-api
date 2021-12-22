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

export class CompanyRequisitesAddressesDto implements  Company.Requisites.Address{
    data: Company.Requisites.Info;
    unrestricted_value: string;
    value: string;

}

export class CompanyManagementDto implements Company.Management{
    disqualified: string | null;
    name: string;
    post: string;
}

export class CompanyRequisitesOPFDto implements Company.Requisites.OPF{
    code: string;
    full: string;
    short: string;
    type: string;

}
export class CompanyRequisitesStateDto implements Company.Requisites.State{
    actuality_date: number;
    code: string | number | null;
    liquidation_date: number | Date | null;
    registration_date: number;
    status: string;

}

export class CompanyRequisitesUsDto implements Company.Requisites.CompanyUs{
    address: CompanyRequisitesAddressesDto;
    authorities: string | null;
    branch_count: number;
    branch_type: string;
    capital: string | null;
    documents: string | null;
    emails: string | null;
    employee_count: number | string | null;
    finance: string | null;
    founders: string | null;
    hid: string | null;
    inn: string;
    kpp: string;
    licenses: string | null;
    management: CompanyManagementDto;
    managers: string | null;
    name: CompanyRequisitesNameDto;
    ogrn: string;
    ogrn_date: number;
    okato: string;
    okfs: string;
    okogu: string;
    okpo: string;
    oktmo: string;
    okved: string;
    okved_type: string;
    okveds: string | null;
    opf: CompanyRequisitesOPFDto;
    phones: string | null;
    predecessors: string | null;
    qc: string | null;
    source: string | null;
    state: CompanyRequisitesStateDto;
    successors: string | null;
    type: string;

}

export class CompanyRequisitesDto implements Company.Requisites.CompanyName {
    companyId: string;
    data: CompanyRequisitesUsDto;
    unrestricted_value: string;
    value: string;

}

export class CompanyDto implements Company.About {
    @ApiProperty()
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
    @ApiProperty()
    requisites: CompanyRequisitesDto;
    @ApiProperty()
    source: string;
    @ApiProperty()
    tags: Array<string>;
    @ApiProperty()
    web: string;

}
