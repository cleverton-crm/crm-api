import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { ParkCompanyDto, ParkCompanyFuelDto, ParkCompanyObjectDto, UpdateParkCompanyObjectDto } from '../dto';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';
import { ApiPagination } from '../decorators/pagination.decorator';

@ApiTags('Park Company')
@Auth('Admin', 'Manager')
@Controller('parkcompany')
export class ParkCompanyController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE') private readonly parkCompanyServiceClient: ClientProxy,
    @Inject('FILES_SERVICE')
    private readonly filesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(ParkCompanyController.name);
  }

  @Post('/create/:company')
  @ApiOperation({
    summary: 'Создание общего хранилища компании',
    description: Core.OperationReadMe('docs/park/create.md'),
  })
  async createPark(
    @Param('company') company: string,
    @Body() parkData: ParkCompanyDto,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    parkData.author = req.user.userID;
    parkData.owner = req.user.userID;
    const sendData = {
      cid: company,
      parkData: parkData,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:create', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/add/store/:parkId')
  @ApiOperation({
    summary: 'Создание емкостного парка',
    description: Core.OperationReadMe('docs/park/add_store.md'),
  })
  async addStoreToPark(@Param('parkId') parkId: string, @Body() storeData: ParkCompanyObjectDto, @Req() req: any) {
    const sendData = {
      parkId: parkId,
      storeData: storeData,
      req: req.user,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:store:create', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/add/:parkId/fuel/:storeId')
  @ApiOperation({
    summary: 'Создание топливного хранилища',
    description: Core.OperationReadMe('docs/park/add_fuel.md'),
  })
  async addFuelToStore(
    @Param('parkId') parkId: string,
    @Param('storeId') storeId: string,
    @Body() fuelData: ParkCompanyFuelDto,
    @Req() req: any,
  ) {
    const sendData = {
      parkId: parkId,
      storeId: storeId,
      fuelData: fuelData,
      req: req.user,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:fuel:create', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/update/:parkId/store/:storeId')
  @ApiOperation({
    summary: 'Изменение емкостного парка',
    description: Core.OperationReadMe('docs/park/update_store.md'),
  })
  async updateStore(
    @Param('parkId') parkId: string,
    @Param('storeId') storeId: string,
    @Body() storeData: UpdateParkCompanyObjectDto,
    @Req() req: any,
  ) {
    const sendData = {
      parkId: parkId,
      storeId: storeId,
      storeData: storeData,
      req: req.user,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:store:update', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/update/:parkId/store/:storeId/fuel/:fuelId')
  @ApiOperation({
    summary: 'Изменение топлива',
    description: Core.OperationReadMe('docs/park/update_fuel.md'),
  })
  async updateFuel(
    @Param('parkId') parkId: string,
    @Param('storeId') storeId: string,
    @Param('fuelId') fuelId: string,
    @Body() fuelData: ParkCompanyFuelDto,
    @Req() req: any,
  ) {
    const sendData = {
      parkId: parkId,
      storeId: storeId,
      fuelId: fuelId,
      fuelData: fuelData,
      req: req.user,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:fuel:update', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/list/:companyId')
  @ApiOperation({
    summary: 'Список хранилищ компаний',
    description: Core.OperationReadMe('docs/park/list.md'),
  })
  @ApiQuery({ name: 'createdAt', required: false })
  @ApiQuery({ name: 'updatedAt', required: false })
  @ApiQuery({ name: 'active', required: false, enum: ['true', 'false'] })
  @ApiPagination()
  async listParks(
    @Param('companyId') companyId: string,
    @MongoPaginationDecorator() pagination: MongoPagination,
    @Query('createdAt') createdAt: string,
    @Query('updatedAt') updatedAt: string,
    @Query('active') active: boolean = true,
    @Req() req: any,
  ) {
    let sendData = {
      companyId: companyId,
      pagination: pagination,
      req: req.user,
      active: active,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:list', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Поиск хранилища компании',
    description: Core.OperationReadMe('docs/park/find.md'),
  })
  async findPark(@Param('id') id: string, @Req() req: any) {
    let sendData = {
      id: id,
      req: req.user,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:find', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/archive/:id')
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация хранилища компании',
    description: Core.OperationReadMe('docs/park/archive.md'),
  })
  async archivePark(@Param('id') id: string, @Query('active') active: boolean, @Req() req: any) {
    const sendData = {
      id: id,
      active: active,
      req: req.user,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:archive', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/delete/:parkId/store/:storeId')
  @ApiOperation({
    summary: 'Удаление емкостного парка',
    description: Core.OperationReadMe('docs/park/delete_store.md'),
  })
  async deleteStore(@Param('parkId') parkId: string, @Param('storeId') storeId: string, @Req() req: any) {
    const sendData = {
      parkId: parkId,
      storeId: storeId,
      req: req.user,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:store:delete', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/delete/:parkId/store/:storeId/fuel/:fuelId')
  @ApiOperation({
    summary: 'Удаление топлива',
    description: Core.OperationReadMe('docs/park/delete_fuel.md'),
  })
  async deleteFuel(
    @Param('parkId') parkId: string,
    @Param('storeId') storeId: string,
    @Param('fuelId') fuelId: string,
    @Req() req: any,
  ) {
    const sendData = {
      parkId: parkId,
      storeId: storeId,
      fuelId: fuelId,
      req: req.user,
    };
    const response = await SendAndResponseData(this.parkCompanyServiceClient, 'park:fuel:delete', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
