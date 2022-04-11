import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Controller, Get, Inject, Logger, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { ApiPagination } from '../decorators/pagination.decorator';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';

@ApiTags('Activity')
@Auth('Admin', 'Manager')
@Controller('activity')
export class ActivityController {
  private logger: Logger;

  constructor(@Inject('COMPANY_SERVICE') private readonly activityServiceClient: ClientProxy) {
    this.logger = new Logger(ActivityController.name);
  }

  @Get('/list')
  @ApiOperation({
    summary: 'Список историй изменений',
    description: Core.OperationReadMe('docs/activity/list.md'),
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Тип объекта, который был изменен: company, client, task, cars',
  })
  @ApiQuery({
    name: 'objectId',
    required: false,
    description: 'Идентификатор объекта, который был изменен',
  })
  @ApiPagination()
  async listActivity(
    @MongoPaginationDecorator() pagination: MongoPagination,
    @Query('type') type: string,
    @Query('objectId') objectId: string,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      type: type,
      objectId: objectId,
      pagination: pagination,
    };
    const response = await SendAndResponseData(this.activityServiceClient, 'activity:list', sendData);
    return response;
  }

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Поиск истории изменения',
    description: Core.OperationReadMe('docs/activity/find.md'),
  })
  async findActivity(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(this.activityServiceClient, 'activity:find', id);
    return response;
  }
}
