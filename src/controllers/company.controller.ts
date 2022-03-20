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
import { CompanyDto, ResponseRecordsDataDto, ResponseSuccessDto, ResponseUnauthorizedDto } from '../dto';
import { SendAndResponseData } from '../helpers/global';
import { Auth } from '../decorators/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileOptions } from '../helpers/file-options';
import { ApiPagination } from '../decorators/pagination.decorator';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';
import { fileImagesOptions } from '../helpers/file-images-options';

@ApiTags('Companies')
@Auth('Admin', 'Manager')
@Controller('companies')
export class CompanyController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE')
    private readonly companyServiceClient: ClientProxy,
    @Inject('FILES_SERVICE')
    private readonly filesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(CompanyController.name);
  }

  /**
   * <<<<<<<<<<<<<<<<<<<<
   * Создание компании
   * <<<<<<<<<<<<<<<<<<<<
   * @param ownerId
   * @param req
   * @param companyData
   */
  @Post('/create')
  @ApiOperation({
    summary: 'Создание компании',
    description: Core.OperationReadMe('docs/company/create.md'),
  })
  @ApiQuery({ name: 'owner', required: false })
  @ApiResponse({ type: CompanyDto, status: HttpStatus.OK })
  async createCompany(
    @Query('owner') ownerId: string,
    @Req() req: any,
    @Body() companyData: CompanyDto,
  ): Promise<Core.Response.Answer> {
    companyData.owner = ownerId || req.user.userID;
    const response = await SendAndResponseData(this.companyServiceClient, 'company:create', companyData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * <<<<<<<<<<<<<<<<<<<<
   * Изменение данных о компании
   * <<<<<<<<<<<<<<<<<<<<
   * @param ownerId
   * @param companyData
   * @param id
   * @param req
   */
  @Patch('/:id/update')
  @ApiOperation({
    summary: 'Изменение данных о компании',
    description: Core.OperationReadMe('docs/company/update.md'),
  })
  @ApiQuery({ name: 'owner', required: false })
  async updateCompany(
    @Param('id') id: string,
    @Query('owner') ownerId: string,
    @Body() companyData: CompanyDto,
    @Req() req: any,
  ) {
    companyData.owner = ownerId || req.user.userID;
    const sendData = {
      id: id,
      userId: req.user.userID,
      data: companyData,
    };
    const response = await SendAndResponseData(this.companyServiceClient, 'company:update', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * <<<<<<<<<<<<<<<<<<<<
   * Список всех компаний
   * <<<<<<<<<<<<<<<<<<<<
   */
  @Get('/list')
  @ApiOperation({
    summary: 'Список всех компаний',
    description: Core.OperationReadMe('docs/company/list.md'),
  })
  @ApiQuery({ name: 'searchFilter', required: false })
  @ApiPagination()
  async listCompanies(
    @MongoPaginationDecorator() pagination: Core.MongoPagination,
    @Query('searchFilter') searchFilter: string,
    @Req() req: any,
  ): Promise<ResponseRecordsDataDto> {
    const sendData = {
      searchFilter: searchFilter,
      pagination: pagination,
      req: req.user,
    };
    const response = await SendAndResponseData(this.companyServiceClient, 'company:list', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * <<<<<<<<<<<<<<<<<<<<
   * Поиск одной компании
   * <<<<<<<<<<<<<<<<<<<<
   * @param id
   */
  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск компании по ID',
    description: Core.OperationReadMe('docs/company/find.md'),
  })
  async findCompany(@Param('id') id: string) {
    const response = await SendAndResponseData(this.companyServiceClient, 'company:find', id);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * Проверка существования компании с указанным ИНН
   * @param inn
   */
  @Get('/:inn/checkout')
  @ApiOperation({
    summary: 'Проверка ИНН компании',
    description: Core.OperationReadMe('docs/company/checkout.md'),
  })
  async checkoutCompany(@Param('inn') inn: string) {
    const response = await SendAndResponseData(this.companyServiceClient, 'company:checkout', inn);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * Архивация компании
   * @param id
   * @param active
   * @param req
   */
  @Delete('/:id/archive')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация компании',
    description: Core.OperationReadMe('docs/company/archive.md'),
  })
  async archiveCompany(
    @Param('id') id: string,
    @Query('active') active: boolean,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      userId: req.user.userID,
      active: active,
    };
    const response = await SendAndResponseData(this.companyServiceClient, 'company:archive', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /** UPLOAD FILES ALL */

  @Post('/attachments/:id/upload/')
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
    summary: 'Загрузка документов',
    description: Core.OperationReadMe('docs/files/upload.md'),
  })
  @ApiNotFoundResponse({ description: 'Контакт не найден' })
  @UseInterceptors(FilesInterceptor('file', 10, fileOptions))
  async upload(@UploadedFiles() file, @Param('id') id: string, @Body() comment, @Req() req: any): Promise<any> {
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:company:upload', sendData);
    this.logger.log(cyan(responseData));
    return responseData;
  }

  /** GET LIST FILES */

  @Get('/attachments/:id/list')
  @ApiOperation({
    summary: 'Список всех файлов',
    description: Core.OperationReadMe('docs/files/download.md'),
  })
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  async fileList(@Req() req: any, @Param('id') id: string): Promise<Core.Response.Answer | Core.Response.Error> {
    const sendData = { id: id, owner: req.user.userID };
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:company:list', sendData);
    this.logger.log(cyan(responseData));
    return responseData;
  }

  /** GET FILES BY ID */

  @Get('/attachments/:id/download/:fileID')
  @ApiOperation({
    summary: 'Скачать файл (документ)',
    description: Core.OperationReadMe('docs/files/download.md'),
  })
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  async download(
    @Req() req: any,
    @Param('id') id: string,
    @Param('fileID') file: string,
  ): Promise<Core.Response.Answer | Core.Response.Error> {
    const sendData = {
      id: id,
      file: file,
      owner: req.user,
    };
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:company:download', sendData);
    this.logger.log(cyan(responseData));
    return responseData;
  }

  /** DELETE ATTACHMENT FILE  */

  @Delete('/attachments/:id/delete/:fileID')
  @ApiOperation({
    summary: 'Удалить файл (документ)',
    description: Core.OperationReadMe('docs/files/download.md'),
  })
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  async deleteFile(
    @Req() req: any,
    @Param('id') id: string,
    @Param('fileID') file: string,
  ): Promise<Core.Response.Answer | Core.Response.Error> {
    const sendData = {
      id: id,
      file: file,
      owner: req.user,
    };
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:company:delete', sendData);
    this.logger.log(cyan(responseData));
    return responseData;
  }

  /** GET AVATAR BY ID */

  @Get('/avatar/:id')
  @ApiOperation({
    summary: 'Фото или аватар',
    description: Core.OperationReadMe('docs/files/avatar.md'),
  })
  @Auth('Admin', 'Manager')
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  async showAvatar(@Req() req: any, @Param('id') id: string): Promise<Core.Response.Answer | Core.Response.Error> {
    const sendData = { owner: req.user, id: id };
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:company:avatar:show', sendData);
    this.logger.log(cyan(responseData));
    return responseData;
  }

  @Post('/avatar/:id/upload')
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
    summary: 'Загрузка фото или аватар компании',
    description: Core.OperationReadMe('docs/files/avatar.md'),
  })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
    description: 'Требуется авторизация',
  })
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @UseInterceptors(FilesInterceptor('file', 10, fileImagesOptions))
  async uploadAvatar(@UploadedFiles() file, @Req() req: any, @Param('id') id: string): Promise<any> {
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
    const sendData = { owner: req.user.userID, files: response, id: id };
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:company:avatar:upload', sendData);
    this.logger.log(cyan(responseData));
    return responseData;
  }
}
