import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Core } from 'crm-core';
import { CarDto } from '../dto/car.dto';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { Auth } from '../decorators/auth.decorator';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE') private readonly carsServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(CarsController.name);
  }

  @Post('/create/:company')
  @Auth('Admin', 'Manager')
  @ApiQuery({ name: 'owner', required: false })
  @ApiOperation({
    summary: 'Создание транспорта',
    description: Core.OperationReadMe('docs/cars/create.md'),
  })
  async createCar(
    @Param('company') company: string,
    @Query('owner') owner: string,
    @Req() req: any,
    @Body() carData: CarDto,
  ): Promise<any> {
    carData.owner = owner || req.user.userID;
    carData.company = company;
    console.log(carData);
    const response = await SendAndResponseData(
      this.carsServiceClient,
      'cars:create',
      carData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/')
  @Auth('Admin', 'Manager')
  @ApiOperation({
    summary: 'Список транспорта',
    description: Core.OperationReadMe('docs/cars/list.md'),
  })
  async listCars(): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.carsServiceClient,
      'cars:list',
      true,
    );

    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/:id/find')
  @Auth('Admin', 'Manager')
  @ApiOperation({
    summary: 'Поиск транспорта по ID',
    description: Core.OperationReadMe('docs/cars/find.md'),
  })
  async findCar(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.carsServiceClient,
      'cars:find',
      id,
    );

    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/:id/status')
  @Auth('Admin', 'Manager')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация транспорта',
    description: Core.OperationReadMe('docs/cars/archive.md'),
  })
  async archiveCar(
    @Param('id') id: string,
    @Query('active') active: boolean,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
    };
    const response = await SendAndResponseData(
      this.carsServiceClient,
      'cars:archive',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id')
  @Auth('Admin', 'Manager')
  @ApiQuery({ name: 'owner', required: false })
  @ApiQuery({ name: 'company', required: false })
  @ApiOperation({
    summary: 'Изменение данных транспорта',
    description: Core.OperationReadMe('docs/cars/update.md'),
  })
  async updateCar(
    @Param('id') id: string,
    @Query('company') company: string,
    @Query('owner') owner: string,
    @Body() carData: CarDto,
  ): Promise<Core.Response.Answer> {
    if (owner) {
      carData.owner = owner;
    }
    if (company) {
      carData.company = company;
    }
    const sendData = {
      id: id,
      data: carData,
    };
    const response = await SendAndResponseData(
      this.carsServiceClient,
      'cars:update',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
