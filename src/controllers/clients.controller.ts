import {
  ApiBody,
  ApiConsumes,
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
import { fileImagesOptions } from '../helpers/file-images-options';

@ApiTags('Clients')
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
  @Auth('Admin', 'Manager')
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
  @Auth('Admin', 'Manager')
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
  @Auth('Admin', 'Manager')
  @ApiOperation({
    summary: 'Поиск клиента по ID',
    description: Core.OperationReadMe('docs/clients/find.md'),
  })
  @ApiQuery({ name: 'company', required: false, description: 'ID компании' })
  @ApiParam({ name: 'id', description: 'ID клиента компании' })
  async findPersona(
    @Query('company') companyId: string,
    @Param('id') id: string,
  ) {
    const sendData = { id: id, company: companyId };
    const response = await SendAndResponseData(
      this.personaServiceClient,
      'client:find',
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
  @Auth('Admin', 'Manager')
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
  @Auth('Admin', 'Manager')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Загрузка фото или аватар пользователя',
    description: Core.OperationReadMe('docs/profile/avatar.md'),
  })
  @UseInterceptors(FilesInterceptor('file', 10))
  async upload(
    @UploadedFiles() file,
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<any> {
    const response = [];
    file.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      response.push(file);
    });
    const sendData = {
      client: id,
      files: response,
      bucketName: 'client_' + id,
    };
    const responseData = await SendAndResponseData(
      this.filesServiceClient,
      'files:clients:upload',
      sendData,
    );
    this.logger.log(cyan(responseData));
    return responseData;
  }
}
