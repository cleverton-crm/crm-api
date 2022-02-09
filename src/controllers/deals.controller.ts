import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { DealComment, LeadDto } from '../dto/lead.dto';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';

@ApiTags('Deals')
@Controller('deals')
@Auth('Admin', 'Manager')
export class DealsController {
  private logger: Logger;

  constructor(@Inject('COMPANY_SERVICE') private readonly dealsServiceClient: ClientProxy) {
    this.logger = new Logger(DealsController.name);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Создание сделки',
    description: Core.OperationReadMe('docs/deals/create.md'),
  })
  async createDeal(@Req() req: any, @Body() dealData: LeadDto): Promise<Core.Response.Answer> {
    const sendData = {
      data: dealData,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:create', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/update')
  @ApiOperation({
    summary: 'Изменение сделки',
    description: Core.OperationReadMe('docs/deals/update.md'),
  })
  async updateDeal(@Param('id') id: string, @Req() req: any, @Body() dealData: LeadDto): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      userId: req.user.userID,
      data: dealData,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:update', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/change/:id/status/:sid')
  @ApiOperation({
    summary: 'Смена статуса',
    description: Core.OperationReadMe('docs/deals/change_status.md'),
  })
  async changeDealStatus(@Param('id') id: string, @Param('sid') sid: string, @Req() req: any) {
    const sendData = {
      id: id,
      sid: sid,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:change:status', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/change/:id/owner/:oid')
  @ApiOperation({
    summary: 'Смена отвественного менеджера / Передача сделки',
    description: Core.OperationReadMe('docs/deals/change_owner.md'),
  })
  @Auth('Admin')
  async changeOwner(@Param('id') id: string, @Param('oid') oid: string, @Req() req: any) {
    const sendData = {
      id: id,
      oid: oid,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:change:owner', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/comment')
  @ApiOperation({
    summary: 'Добавление комментария к сделке',
    description: Core.OperationReadMe('docs/deals/comment_create.md'),
  })
  async commentDeal(
    @Param('id') id: string,
    @Req() req: any,
    @Body() commentData: DealComment,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      userId: req.user.userID,
      comments: commentData.comments,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:comment', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Список сделок',
    description: Core.OperationReadMe('docs/deals/list.md'),
  })
  async listDeals(@MongoPaginationDecorator() pagination: MongoPagination): Promise<Core.Response.Answer> {
    const sendData = { pagination: pagination };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:list', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск сделки',
    description: Core.OperationReadMe('docs/deals/find.md'),
  })
  async findDeal(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:find', id);
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
  async archiveDeal(@Param('id') id: string, @Query('active') active: boolean): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:archive', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
