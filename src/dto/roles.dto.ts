import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RolesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Guest' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  permissions?: string;
}
