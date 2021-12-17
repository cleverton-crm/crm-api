import { ApiProperty } from '@nestjs/swagger';

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
  gender: string;
  @ApiProperty()
  relationship: string;
  @ApiProperty()
  language: string | null;
  @ApiProperty()
  address: Map<string, any>;
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
