import {ClientCompany} from "crm-core";
import {ApiProperty} from "@nestjs/swagger";

export class ClientCompanySocialVoicesDto implements ClientCompany.SocialVoices{
    discord: string | null;
    fb: string | null;
    skype: string | null;
    slack: string | null;
    telegram: string | null;
    viber: string | null;
    vk: string | null;
    whatsapp: string | null;

}

export class ClientDto  implements ClientCompany.Persona{

    attachments: Map<string, string>;
    birthDate: Date;
    comments: Map<string, string>;
    company: string | null;
    createData: Date;
    email: string;
    emailCompany: string;
    first: string;
    last: string;
    middle: string;
    object: "client";
    owner: string;
    payerType: string | ClientCompany.PayerType;
    permissions: Map<string, any>;
    phones: Array<string>;
    roleInCompany: string;
    socials: Map<string, string>;
    voices: ClientCompany.SocialVoices;
    workPhone: string;
}