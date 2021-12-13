import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: string;
}
