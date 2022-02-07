import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { LeadDto } from '../dto/lead.dto';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { ApiPagination } from '../decorators/pagination.decorator';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';

@ApiTags('Leads')
@Auth('Admin', 'Manager')
@Controller('leads')
export class LeadsController {
  private logger: Logger;

  constructor(@Inject('COMPANY_SERVICE') private readonly leadsServiceClient: ClientProxy) {
    this.logger = new Logger(LeadsController.name);
  }

  /** CREATE LEAD */

  @Post('/create')
  @ApiOperation({
    summary: 'Создание лида',
    description: Core.OperationReadMe('docs/leads/create.md'),
  })
  async createLead(@Req() req: any, @Body() leadData: LeadDto): Promise<Core.Response.Answer> {
    const sendData = {
      data: leadData,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:create', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/change/:id/status/:sid')
  @ApiOperation({
    summary: 'Смена статуса',
    description: Core.OperationReadMe('docs/leads/update.md'),
  })
  async changeLeadStatus(@Param('id') id: string, @Param('sid') sid: string, @Req() req: any) {
    const sendData = {
      id: id,
      sid: sid,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:change:status', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/change/:id/owner/:oid')
  @ApiOperation({
    summary: 'Смена отвественного менеджера / Передача лида',
    description: Core.OperationReadMe('docs/leads/update.md'),
  })
  @Auth('Admin')
  async changeOwner(@Param('id') id: string, @Param('oid') oid: string, @Req() req: any) {
    const sendData = {
      id: id,
      oid: oid,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:change:owner', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /** UPDATE LEAD */
  @Patch('/update/:id')
  @ApiOperation({
    summary: 'Изменение лида',
    description: Core.OperationReadMe('docs/leads/update.md'),
  })
  async updateLead(@Param('id') id: string, @Req() req: any, @Body() leadData: LeadDto): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      owner: req.user,
      data: leadData,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:update', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /** LIST OF LEADS */
  @Get('/list')
  @ApiOperation({
    summary: 'Список лидов',
    description: Core.OperationReadMe('docs/leads/list.md'),
  })
  @ApiPagination()
  async listLead(@MongoPaginationDecorator() pagination: MongoPagination): Promise<Core.Response.Answer> {
    const sendData = { pagination: pagination };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:list', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /** FIND LEAD */

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Поиск лида',
    description: Core.OperationReadMe('docs/leads/find.md'),
  })
  async findLead(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:find', id);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/done/:id')
  @ApiOperation({
    summary: 'Лид переходит в завершенную сделку / Конвертируется в Сделку',
    description: Core.OperationReadMe('docs/leads/update.md'),
  })
  async leadDone(@Param('id') id: string, @Req() req: any) {
    const sendData = {
      id: id,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:done', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/failure/:id')
  @ApiOperation({
    summary: 'Лид отменен',
    description: Core.OperationReadMe('docs/leads/update.md'),
  })
  async leadFailure(@Param('id') id: string, @Req() req: any) {
    const sendData = {
      id: id,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:failure', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/archive/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация лида',
    description: Core.OperationReadMe('docs/leads/archive.md'),
  })
  async archiveLead(@Param('id') id: string, @Query('active') active: boolean): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:archive', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
