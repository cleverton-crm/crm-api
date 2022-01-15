import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { Auth } from '../decorators/auth.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { LeadDto } from '../dto/lead.dto';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { DealDto } from '../dto';

@ApiTags('Leads')
@Controller('leads')
@Auth('Admin', 'Manager')
export class LeadsController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE') private readonly leadsServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(LeadsController.name);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Создание лида',
    description: Core.OperationReadMe('docs/leads/create.md'),
  })
  async createLead(
    @Req() req: any,
    @Body() leadData: LeadDto,
  ): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.leadsServiceClient,
      'leads:create',
      leadData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/update')
  @ApiQuery({ name: 'owner', required: false })
  @ApiOperation({
    summary: 'Изменение лида',
    description: Core.OperationReadMe('docs/leads/update.md'),
  })
  async updateDeal(
    @Param('id') id: string,
    @Query('owner') owner: string,
    @Req() req: any,
    @Body() leadData: LeadDto,
  ): Promise<Core.Response.Answer> {
    if (owner) {
      leadData.owner = owner;
    }
    const sendData = {
      id: id,
      data: leadData,
    };
    const response = await SendAndResponseData(
      this.leadsServiceClient,
      'leads:update',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Список лидов',
    description: Core.OperationReadMe('docs/leads/list.md'),
  })
  async listLead(): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.leadsServiceClient,
      'leads:list',
      true,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск лида',
    description: Core.OperationReadMe('docs/leads/find.md'),
  })
  async findLead(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.leadsServiceClient,
      'leads:find',
      id,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/:id/status')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация лида',
    description: Core.OperationReadMe('docs/leads/archive.md'),
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
      this.leadsServiceClient,
      'leads:archive',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
