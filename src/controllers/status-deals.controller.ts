import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { StatusDealsDto } from '../dto/status-deals.dto';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';

@ApiTags('Status Deals')
@Auth('Admin', 'Manager')
@Controller('statusdeals')
export class StatusDealsController {
  private logger: Logger;

  constructor(@Inject('COMPANY_SERVICE') private readonly statusDealsServiceClient: ClientProxy) {
    this.logger = new Logger(StatusDealsController.name);
  }

  /** CREATE STATUS */

  @Post('/create')
  @ApiOperation({
    summary: 'Создание статуса',
    description: Core.OperationReadMe('docs/status/create.md'),
  })
  async createStatus(@Req() req: any, @Body() statusData: StatusDealsDto): Promise<Core.Response.Answer> {
    const sendData = {
      data: statusData,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.statusDealsServiceClient, 'status:create', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /** UPDATE STATUS */

  @Patch('/:id/update')
  @ApiOperation({
    summary: 'Изменение данных статуса',
    description: Core.OperationReadMe('docs/status/update.md'),
  })
  async updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body() statusData: StatusDealsDto,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      data: statusData,
    };
    const response = await SendAndResponseData(this.statusDealsServiceClient, 'status:update', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/change/:id/:priority')
  @ApiOperation({
    summary: 'Изменение приоритета статуса',
    description: Core.OperationReadMe('docs/status/change_priority.md'),
  })
  async changePriority(@Param('id') id: string, @Param('priority') priority: number) {
    const sendData = {
      id: id,
      priority: priority,
    };
    const response = await SendAndResponseData(this.statusDealsServiceClient, 'status:change:priority', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /** LIST STATUS */

  @Get('/list')
  @ApiOperation({
    summary: 'Список статусов',
    description: Core.OperationReadMe('docs/status/list.md'),
  })
  async listStatus(): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(this.statusDealsServiceClient, 'status:list', true);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /** FIND STATUS */

  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск статуса',
    description: Core.OperationReadMe('docs/status/find.md'),
  })
  async findStatus(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(this.statusDealsServiceClient, 'status:find', id);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /** ARCHIVE STATUS */

  @Delete('/:id/archive')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация статуса',
    description: Core.OperationReadMe('docs/status/archive.md'),
  })
  async archiveStatus(@Param('id') id: string, @Query('active') active: boolean): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
    };
    const response = await SendAndResponseData(this.statusDealsServiceClient, 'status:archive', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
