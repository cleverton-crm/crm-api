import { Body, Controller, Delete, Get, Inject, Logger, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @Post('/create')
  @ApiOperation({
    summary: 'Создание статуса',
    description: Core.OperationReadMe('docs/status/create.md'),
  })
  async createStatus(@Req() req: any, @Body() statusData: StatusDealsDto) {
    statusData.owner = req.user.userID;
    const response = await SendAndResponseData(this.statusDealsServiceClient, 'status:deals:create', statusData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/update')
  @ApiOperation({
    summary: 'Изменение данных статуса',
    description: Core.OperationReadMe('docs/status/update.md'),
  })
  async updateStatus() {}

  @Get('/list')
  @ApiOperation({
    summary: 'Список статусов',
    description: Core.OperationReadMe('docs/status/list.md'),
  })
  async listStatus() {}

  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск статуса',
    description: Core.OperationReadMe('docs/status/find.md'),
  })
  async findStatus() {}

  @Delete('/:id/archive')
  @ApiOperation({
    summary: 'Архивация статуса',
    description: Core.OperationReadMe('docs/status/archive.md'),
  })
  async archiveStatus() {}
}
