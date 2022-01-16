import { ApiProperty } from '@nestjs/swagger';
import { Core } from 'crm-core';
import { MAX, MaxLength, MinLength } from 'class-validator';

export class ProfileDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: string;
}

export class DriverLicenseDto implements Core.Profiles.DriverLicense {
  @ApiProperty({ default: null })
  dateOfIssue: Date;
  @ApiProperty({ default: null })
  endDate: Date;
  @ApiProperty()
  number: string;
}

export class PassportDto implements Core.Profiles.Passport {
  @ApiProperty({ default: null })
  dateOfIssue: Date;
  @ApiProperty()
  number: string;
  @ApiProperty()
  series: string;
  @ApiProperty()
  issuedBy: string;
}

export class PersonalDocumentDto implements Core.Profiles.PersonalDocument {
  driver_license: DriverLicenseDto;
  passport: PassportDto;
}

export class ProfilesRequisitesDto implements Core.Profiles.Requisites {
  @ApiProperty({ example: '41256272839271524357' })
  @MinLength(20)
  @MaxLength(20)
  payment: string;
  @ApiProperty({ description: 'ХХХ-ХХХ-ХХХ YY', default: '500-400-301 12' })
  snils: string;
  @ApiProperty({ example: '4000-0000-0000-0002' })
  card: string;
  @ApiProperty({ example: '30101810145250000974' })
  correspondent: string;
  @ApiProperty({ example: '77027233727' })
  inn: string;
  @ApiProperty({ example: 'АО "ТИНЬКОФФ БАНК"' })
  bank: string;
  @ApiProperty({ example: '044525974' })
  bik: string;
  @ApiProperty({ example: '7710140679' })
  innBank: string;
}

export class ProfilePersonaDto implements Core.Profiles.Update {
  id?: string;

  @ApiProperty({ example: 'Начальника' })
  title: string | null;

  @ApiProperty({ example: 'JSON' })
  firstName: string | null;

  @ApiProperty({ example: 'Stathem' })
  lastName: string | null;

  @ApiProperty({ example: null })
  middleName: string | null;

  @ApiProperty({ example: 'Driver' })
  nickName: string;

  @ApiProperty({
    example: 'Что тут сказать о себе , про меня и так все все знают',
  })
  about: string | null;

  @ApiProperty({ example: 'man' })
  gender: string;

  @ApiProperty({ example: 'Женат' })
  relationship: string;

  @ApiProperty({ example: 'ru' })
  language: string | null;

  @ApiProperty()
  address: Map<string, any>;

  @ApiProperty({ example: '1967-06-26T00:00:00.000Z' })
  birthDate: Date;

  @ApiProperty({ example: ['ru', 'en', 'fr'] })
  speakLanguage: Array<string>;

  @ApiProperty({
    example: {
      facebook: 'https://facebook.com/JasonStatham',
      vk: 'https://vk.com/jasonstatham_officialgroup',
    },
  })
  socials: Map<string, any>;

  @ApiProperty()
  passport: PersonalDocumentDto;

  @ApiProperty()
  requisites: ProfilesRequisitesDto;
}
