import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { cyan } from 'cli-color';
import { SendAndResponseData } from '../helpers/global';
import { ClientDto } from '../dto/client.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  private logger: Logger;

  constructor(
    @Inject('CLIENTS_SERVICE')
    private readonly personaServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(ClientController.name);
  }

  /**
   * Создание клиента
   * @param clientData
   */
  @Post('/')
  @ApiOperation({
    summary: 'Создание клиента компании',
    description: Core.OperationReadMe('docs/clients/create.md'),
  })
  @ApiResponse({ type: ClientDto, status: HttpStatus.OK })
  async createPersona(
    @Body() clientData: ClientDto,
  ): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.personaServiceClient,
      'client:create',
      clientData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Список всех клиентов',
    description: Core.OperationReadMe('docs/clients/list.md'),
  })
  async listPersona() {
    const response = await SendAndResponseData(
      this.personaServiceClient,
      'client:list',
      true,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Поиск клиента по ID',
    description: Core.OperationReadMe('docs/clients/find.md'),
  })
  async findPersona(@Param('id') id: string) {
    const response = await SendAndResponseData(
      this.personaServiceClient,
      'client:find',
      id,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * Архивация клиента
   * @param id
   * @param active
   */
  @Delete('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация клиента',
    description: Core.OperationReadMe('docs/clients/archive.md'),
  })
  async archivePersona(
    @Param('id') id: string,
    @Query('active') active: boolean,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
    };
    const response = await SendAndResponseData(
      this.personaServiceClient,
      'client:archive',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
