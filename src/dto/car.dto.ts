import { Core } from 'crm-core';
import { ApiProperty } from '@nestjs/swagger';

export class CarVehicle implements Core.Cars.VehicleData {
  @ApiProperty()
  tractor: string;

  @ApiProperty()
  semitrailer: string;
}

export class CarDto implements Core.Cars.Schema {
  _id: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  company: string;
  active: boolean;

  @ApiProperty({ example: { tractor: 'MAN', semitrailer: 'ATLANT' } })
  model: CarVehicle;

  @ApiProperty({ example: { tractor: 'А151АА', semitrailer: 'С111АС' } })
  govNumber: CarVehicle;

  @ApiProperty({
    example: { tractor: 'WBA47110007817985', semitrailer: 'WVWDB4505LK234567' },
  })
  vin: CarVehicle;

  @ApiProperty({ example: { tractor: '306', semitrailer: '314' } })
  typeTS: CarVehicle;

  @ApiProperty({ example: { tractor: '2010', semitrailer: '2011' } })
  issueYear: CarVehicle;

  @ApiProperty({ example: { tractor: '817985', semitrailer: '234567' } })
  chassis: CarVehicle;

  @ApiProperty({ example: { tractor: '1100', semitrailer: '4505' } })
  carcase: CarVehicle;

  @ApiProperty({ example: { tractor: 'красный', semitrailer: 'белый' } })
  color: CarVehicle;

  @ApiProperty({ example: { tractor: '750', semitrailer: '0' } })
  enginePower: CarVehicle;

  @ApiProperty({ example: { tractor: '21.55', semitrailer: '28.65' } })
  maxMass: CarVehicle;

  @ApiProperty({ example: { tractor: '9.28', semitrailer: '9.28' } })
  curbWeight: CarVehicle;

  @ApiProperty({ example: { tractor: 'MAN', semitrailer: 'ATLANT' } })
  ownerCar: CarVehicle;

  @ApiProperty({ example: { tractor: '5700', semitrailer: '2480' } })
  calibration: CarVehicle;
}
