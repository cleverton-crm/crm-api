import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ListRolesDto, RolesDto, UpdateRolesDto } from '../dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';
import { Core } from 'crm-core';
import { SendAndResponseData } from '../helpers/global';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  private logger: Logger;
  constructor(@Inject('ROLES_SERVICE') private readonly rolesServiceClient: ClientProxy) {
    this.logger = new Logger(RolesController.name);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Creating role for user',
    description: Core.OperationReadMe('docs/roles/create.md'),
  })
  async create(@Body() rolesData: RolesDto) {
    const response = await SendAndResponseData(this.rolesServiceClient, 'roles:create', rolesData);
    if (response.statusCode !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          statusCode: response.statusCode,
          message: response.message,
          errors: response.errors,
        },
        response.statusCode,
      );
    }
    return response;
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Updating role',
    description: Core.OperationReadMe('docs/roles/update.md'),
  })
  async update(@Param('id') id: string, @Body() rolesData: UpdateRolesDto) {
    const sendData = {
      id: id,
      ...rolesData,
    };
    const response = await SendAndResponseData(this.rolesServiceClient, 'roles:update', sendData);
    return response;
  }

  @Get('/list')
  @UseGuards(RolesGuard, AuthGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @ApiOperation({
    summary: 'Get list of all roles',
    description: Core.OperationReadMe('docs/roles/list.md'),
  })
  async findAllRoles(): Promise<ListRolesDto[]> {
    const response = await SendAndResponseData(this.rolesServiceClient, 'roles:list', true);
    return response;
  }
}
