import {
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
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
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { cyan } from 'cli-color';
import { SendAndResponseData } from '../helpers/global';
import { ClientDto } from '../dto/client.dto';
import { Auth } from '../decorators/auth.decorator';
import { ResponseSuccessDto, ResponseUnauthorizedDto } from '../dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileOptions } from '../helpers/file-options';

@ApiTags('Clients')
@Auth('Admin', 'Manager')
@Controller('clients')
export class ClientController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE')
    private readonly personaServiceClient: ClientProxy,
    @Inject('FILES_SERVICE')
    private readonly filesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(ClientController.name);
  }

  /**
   * Создание клиента
   * @param req
   * @param owner
   * @param cid
   * @param clientData
   */
  @Post('/:company/:owner/add')
  @ApiOperation({
    summary: 'Создание клиента компании',
    description: Core.OperationReadMe('docs/clients/create.md'),
  })
  @ApiParam({ name: 'owner', required: false })
  @ApiResponse({ type: ClientDto, status: HttpStatus.OK })
  async createPersona(
    @Req() req: any,
    @Param('owner') owner: string,
    @Param('company') cid: string,
    @Body() clientData: ClientDto,
  ): Promise<Core.Response.Answer> {
    clientData.owner = owner || req.user.userID;
    clientData.company = cid;
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

  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск клиента по ID',
    description: Core.OperationReadMe('docs/clients/find.md'),
  })
  @ApiParam({ name: 'id', description: 'ID клиента компании' })
  async findPersona(@Param('id') id: string) {
    const response = await SendAndResponseData(
      this.personaServiceClient,
      'client:find',
      id,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/update')
  @ApiOperation({
    summary: 'Изменение данных клиента',
    description: Core.OperationReadMe('docs/clients/update.md'),
  })
  async updatePersona(@Param('id') id: string, @Body() updateData: ClientDto) {
    const sendData = {
      id: id,
      data: updateData,
    };
    const response = await SendAndResponseData(
      this.personaServiceClient,
      'client:update',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * Архивация клиента
   * @param id
   * @param active
   */
  @Delete('/:id/status')
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

  @Post('/:id/attachments/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        comments: {
          type: 'string',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Укажите ID клиента' })
  @ApiOperation({
    summary: 'Загрузка документов, файлов клиента',
    description: Core.OperationReadMe('docs/clients/upload.md'),
  })
  @ApiNotFoundResponse({ description: 'Контакт не найден' })
  @UseInterceptors(FilesInterceptor('file', 10, fileOptions))
  async upload(
    @UploadedFiles() file,
    @Param('id') id: string,
    @Body() comment,
    @Req() req: any,
  ): Promise<any> {
    const response = [];
    file.forEach((file) => {
      response.push(file);
    });
    const sendData = {
      owner: req.user.userID,
      client: id,
      files: response,
      bucketName: 'client_' + id,
      comments: comment.comments,
    };
    const responseData = await SendAndResponseData(
      this.filesServiceClient,
      'files:clients:upload',
      sendData,
    );
    this.logger.log(cyan(responseData));
    return responseData;
  }

  @Get('/:id/attachments/list')
  @ApiOperation({
    summary: 'Список всех файлов для клиента',
    description: Core.OperationReadMe('docs/clients/download.md'),
  })
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  async fileList(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<Core.Response.Answer | Core.Response.Error> {
    const sendData = { id: id, owner: req.user.userID };
    const responseData = await SendAndResponseData(
      this.filesServiceClient,
      'files:clients:list',
      sendData,
    );
    this.logger.log(cyan(responseData));
    return responseData;
  }

  @Get('/:id/attachments/download')
  @ApiOperation({
    summary: 'Скачать файл (документ)',
    description: Core.OperationReadMe('docs/clients/download.md'),
  })
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  async download(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<Core.Response.Answer | Core.Response.Error> {
    const sendData = { id: id, owner: req.user.userID };
    const responseData = await SendAndResponseData(
      this.filesServiceClient,
      'files:clients:download',
      sendData,
    );
    this.logger.log(cyan(responseData));
    return responseData;
  }
}
