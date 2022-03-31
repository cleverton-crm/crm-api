import { ApiProperty, OmitType } from '@nestjs/swagger';

export class ParkCompanyObjectDto {
  @ApiProperty({ example: 'Емкостный парк #1' })
  name: string; // Название

  @ApiProperty({ example: 'Адрес' })
  address?: string; // Адрес

  @ApiProperty({ example: true })
  havePump?: boolean; // Наличе насоса

  @ApiProperty({ example: '1000' })
  distance?: string; // Дистанция по бездорожью

  @ApiProperty({ example: [] })
  fuels: ParkCompanyFuelDto[]; // Виды топлива
}

export class UpdateParkCompanyObjectDto extends OmitType(ParkCompanyObjectDto, ['fuels'] as const) {}

export class ParkCompanyFuelDto {
  @ApiProperty({ example: 'АИ-92' })
  name: string; // Тип топлива

  @ApiProperty({ example: 50 })
  capacity: number; // Емкость

  @ApiProperty({ example: 20 })
  consumption: number; // Потребление
}

export class ParkCompanyDto {
  company: string;
  object: 'park';
  author: string;
  owner: string;

  @ApiProperty({ example: {} })
  store: Map<string, ParkCompanyObjectDto>;
}

export class ParkCompanyRequestDto {
  @ApiProperty()
  company: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  store: [];

  @ApiProperty()
  allCapacity: number;

  @ApiProperty()
  allConsumption: number;
}
