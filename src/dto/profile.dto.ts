import { ApiProperty } from '@nestjs/swagger';
import { Core } from 'crm-core';

export class ProfileDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: string;
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
  passport: Core.Profiles.PersonalDocument;

  @ApiProperty({ example: {} })
  requisites: Map<string, any> | Core.Profiles.Requisites;
}
