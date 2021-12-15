import { ApiProperty } from '@nestjs/swagger';
import { Profiles } from '../../../micro-profile/types/profiles';

export class ProfileDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: string;
}

export class ProfilePersonaDto {
  @ApiProperty()
  title: string | null;
  @ApiProperty()
  firstName: string | null;
  @ApiProperty()
  lastName: string | null;
  @ApiProperty()
  maidenName: string | null;
  @ApiProperty()
  nickName: string;
  @ApiProperty()
  about: string | null;
  @ApiProperty()
  gender: string | Profiles.Gender;
  @ApiProperty()
  relationship: string | Profiles.Relationship;
  @ApiProperty()
  language: string | null;
  @ApiProperty()
  address: Map<string, any> | Profiles.Address;
  @ApiProperty()
  birthDate: Date;
  @ApiProperty()
  customer: string;
  @ApiProperty()
  speakLanguage: Array<string>;
  @ApiProperty()
  socials: Map<string, any>;
  @ApiProperty()
  type: string;
}
