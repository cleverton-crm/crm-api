import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { DealComment, LeadDto } from '../dto/lead.dto';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { ApiPagination } from '../decorators/pagination.decorator';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';
import { ClientDto, CompanyDto } from '../dto';

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
    description: Core.OperationReadMe('docs/leads/change_status.md'),
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
    description: Core.OperationReadMe('docs/leads/change_owner.md'),
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

  @Patch('/:id/company/:cid')
  @ApiOperation({
    summary: 'Изменение данных компании',
    description: Core.OperationReadMe('docs/leads/update_company.md'),
  })
  async updateLeadCompany(
    @Param('id') id: string,
    @Param('cid') cid: string,
    @Body() updateData: CompanyDto,
    @Req() req: any,
  ) {
    const sendData = {
      id: id,
      cid: cid,
      data: updateData,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:company:update', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/client/:cid')
  @ApiOperation({
    summary: 'Изменение данных клиента',
    description: Core.OperationReadMe('docs/leads/update_client.md'),
  })
  async updateLeadClient(
    @Param('id') id: string,
    @Param('cid') cid: string,
    @Body() updateData: ClientDto,
    @Req() req: any,
  ) {
    const sendData = {
      id: id,
      cid: cid,
      data: updateData,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:client:update', sendData);
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
  @ApiQuery({ name: 'searchFilter', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'fuelType', required: false })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'createdAt', required: false })
  @ApiQuery({ name: 'updatedAt', required: false })
  @ApiQuery({ name: 'active', required: false, enum: ['true', 'false'] })
  @ApiPagination()
  async listLead(
    @MongoPaginationDecorator() pagination: MongoPagination,
    @Query('searchFilter') searchFilter: string,
    @Query('status') status: string,
    @Query('fuelType') fuelType: string,
    @Query('source') source: string,
    @Query('createdAt') createdAt: string,
    @Query('updatedAt') updatedAt: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('active') active: boolean = true,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    let sendData = {
      pagination: pagination,
      searchFilter: searchFilter,
      req: req.user,
      status: status,
      fuelType: fuelType,
      source: source,
      active: active,
      createdAt: createdAt,
      updatedAt: updatedAt,
      startDate: startDate,
      endDate: endDate,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:list', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/clients/list')
  @ApiOperation({
    summary: 'Список клиентов лидов',
    description: Core.OperationReadMe('docs/leads/list_clients.md'),
  })
  @ApiPagination()
  async listLeadClients(
    @MongoPaginationDecorator() pagination: MongoPagination,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      pagination: pagination,
      req: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:clients:list', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/companies/list')
  @ApiOperation({
    summary: 'Список компаний лидов',
    description: Core.OperationReadMe('docs/leads/list_companies.md'),
  })
  @ApiPagination()
  async listLeadCompanies(
    @MongoPaginationDecorator() pagination: MongoPagination,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      pagination: pagination,
      req: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:companies:list', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /** FIND LEAD */

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Поиск лида',
    description: Core.OperationReadMe('docs/leads/find.md'),
  })
  async findLead(@Param('id') id: string, @Req() req: any): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      req: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:find', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/client/find/:id')
  @ApiOperation({
    summary: 'Поиск клиента лида',
    description: Core.OperationReadMe('docs/leads/find_client.md'),
  })
  async findLeadClient(@Param('id') id: string, @Req() req: any): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      req: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:client:find', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/company/find/:id')
  @ApiOperation({
    summary: 'Поиск компании лида',
    description: Core.OperationReadMe('docs/leads/find_company.md'),
  })
  async findLeadCompany(@Param('id') id: string, @Req() req: any): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      req: req.user,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:company:find', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/done/:id')
  @ApiOperation({
    summary: 'Лид переходит в завершенную сделку / Конвертируется в Сделку',
    description: Core.OperationReadMe('docs/leads/done.md'),
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

  @Patch('/:id/comment')
  @ApiOperation({
    summary: 'Добавление комментария к сделке',
    description: Core.OperationReadMe('docs/deals/comment_create.md'),
  })
  async commentLead(
    @Param('id') id: string,
    @Req() req: any,
    @Body() commentData: DealComment,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      userId: req.user,
      comments: commentData,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:comment', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/failure/:id')
  @ApiOperation({
    summary: 'Лид отменен',
    description: Core.OperationReadMe('docs/leads/failure.md'),
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
  async archiveLead(
    @Param('id') id: string,
    @Query('active') active: boolean,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      userId: req.user,
      active: active,
    };
    const response = await SendAndResponseData(this.leadsServiceClient, 'leads:archive', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
