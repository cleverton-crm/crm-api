import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { DealDto } from '../dto';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';

@ApiTags('Deals')
@Controller('deals')
@Auth('Admin', 'Manager')
export class DealsController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE') private readonly dealsServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(DealsController.name);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Создание сделки',
    description: Core.OperationReadMe('docs/deals/create.md'),
  })
  async createDeal(
    @Req() req: any,
    @Body() dealData: DealDto,
  ): Promise<Core.Response.Answer> {
    dealData.author = req.user.userID;
    const response = await SendAndResponseData(
      this.dealsServiceClient,
      'deals:create',
      dealData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Список сделок',
    description: Core.OperationReadMe('docs/deals/list.md'),
  })
  async listDeals(): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.dealsServiceClient,
      'deals:list',
      true,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск сделки',
    description: Core.OperationReadMe('docs/deals/find.md'),
  })
  async findDeal(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.dealsServiceClient,
      'deals:find',
      id,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/:id/status')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация сделки',
    description: Core.OperationReadMe('docs/deals/archive.md'),
  })
  async archiveDeal(
    @Param('id') id: string,
    @Query('active') active: boolean,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
    };
    const response = await SendAndResponseData(
      this.dealsServiceClient,
      'deals:archive',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
