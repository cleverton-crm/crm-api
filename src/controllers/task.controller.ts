import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Core } from 'crm-core';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { Auth } from '../decorators/auth.decorator';
import { TaskDto } from '../dto';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';
import { ApiPagination } from '../decorators/pagination.decorator';

@ApiTags('Task')
@Auth('Admin', 'Manager')
@Controller('task')
export class TaskController {
  private logger: Logger;

  constructor(@Inject('COMPANY_SERVICE') private readonly taskServiceClient: ClientProxy) {
    this.logger = new Logger(TaskController.name);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Создание задачи',
    description: Core.OperationReadMe('docs/task/create.md'),
  })
  async createTask(
    @Query('linkId') linkId: string,
    @Req() req: any,
    @Body() taskData: TaskDto,
  ): Promise<Core.Response.Answer> {
    if (linkId) {
      taskData.linkId = linkId;
    }
    taskData.owner = req.user.userID;
    const response = await SendAndResponseData(this.taskServiceClient, 'task:create', taskData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/update/:id')
  @ApiOperation({
    summary: 'Изменение задачи',
    description: Core.OperationReadMe('docs/task/update.md'),
  })
  @ApiQuery({ name: 'linkId', required: false })
  async updateTask(
    @Param('id') id: string,
    @Query('linkId') linkId: string,
    @Body() updateData: TaskDto,
    @Req() req: any,
  ) {
    if (linkId) {
      updateData.linkId = linkId;
    }
    const sendData = {
      id: id,
      data: updateData,
      req: req.user,
    };
    console.log(sendData);
    const response = await SendAndResponseData(this.taskServiceClient, 'task:update', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/list')
  @ApiOperation({
    summary: 'Список задач',
    description: Core.OperationReadMe('docs/task/list.md'),
  })
  @ApiQuery({ name: 'createdAt', required: false })
  @ApiQuery({ name: 'updatedAt', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({
    name: 'linkType',
    required: false,
    description: 'Принимает тип объекта, к которому привязана задача: company, client, task, cars',
    example: 'company',
  })
  @ApiQuery({
    name: 'linkId',
    required: false,
    description: 'Прнимает ID по объекту к которому привязан. Должен совпадать с типом',
  })
  @ApiQuery({ name: 'status', required: false, enum: ['true', 'false'] })
  @ApiPagination()
  async listTasks(
    @MongoPaginationDecorator() pagination: MongoPagination,
    @Query('createdAt') createdAt: string,
    @Query('updatedAt') updatedAt: string,
    @Query('status') status: boolean = true,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('linkType') linkType: string,
    @Query('linkId') linkId: string,
  ) {
    const sendData = {
      createdAt: createdAt,
      updatedAt: updatedAt,
      status: status,
      startDate: startDate,
      endDate: endDate,
      pagination: pagination,
      linkType: linkType,
      linkId: linkId,
    };
    const response = await SendAndResponseData(this.taskServiceClient, 'task:list', sendData);
    return response;
  }

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Поиск задачи',
    description: Core.OperationReadMe('docs/task/find.md'),
  })
  async findTask(@Param('id') id: string) {
    const response = await SendAndResponseData(this.taskServiceClient, 'task:find', id);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'Список задач',
    description: Core.OperationReadMe('docs/task/delete.md'),
  })
  async deleteTask(@Param('id') id: string, @Req() req: any) {
    const sendData = {
      id: id,
      req: req.user,
    };
    const response = await SendAndResponseData(this.taskServiceClient, 'task:delete', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
