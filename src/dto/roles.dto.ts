import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

export class UpdateRolesDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  permissions?: string;

  @IsNumber()
  @ApiProperty()
  priority: number;
}

export class ListRolesDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  permissions: string;

  @ApiProperty()
  priority: number;
}
