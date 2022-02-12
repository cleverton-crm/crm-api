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
import { Auth } from '../decorators/auth.decorator';
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
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { DealComment, LeadDto } from '../dto/lead.dto';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileOptions } from '../helpers/file-options';
import { ResponseSuccessDto, ResponseUnauthorizedDto } from '../dto';
import { fileImagesOptions } from '../helpers/file-images-options';

@ApiTags('Deals')
@Controller('deals')
@Auth('Admin', 'Manager')
export class DealsController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE') private readonly dealsServiceClient: ClientProxy,
    @Inject('FILES_SERVICE')
    private readonly filesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(DealsController.name);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Создание сделки',
    description: Core.OperationReadMe('docs/deals/create.md'),
  })
  async createDeal(@Req() req: any, @Body() dealData: LeadDto): Promise<Core.Response.Answer> {
    const sendData = {
      data: dealData,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:create', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/update')
  @ApiOperation({
    summary: 'Изменение сделки',
    description: Core.OperationReadMe('docs/deals/update.md'),
  })
  async updateDeal(@Param('id') id: string, @Req() req: any, @Body() dealData: LeadDto): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      userId: req.user.userID,
      data: dealData,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:update', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/change/:id/status/:sid')
  @ApiOperation({
    summary: 'Смена статуса',
    description: Core.OperationReadMe('docs/deals/change_status.md'),
  })
  async changeDealStatus(@Param('id') id: string, @Param('sid') sid: string, @Req() req: any) {
    const sendData = {
      id: id,
      sid: sid,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:change:status', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/change/:id/owner/:oid')
  @ApiOperation({
    summary: 'Смена отвественного менеджера / Передача сделки',
    description: Core.OperationReadMe('docs/deals/change_owner.md'),
  })
  @Auth('Admin')
  async changeOwner(@Param('id') id: string, @Param('oid') oid: string, @Req() req: any) {
    const sendData = {
      id: id,
      oid: oid,
      owner: req.user,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:change:owner', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/comment')
  @ApiOperation({
    summary: 'Добавление комментария к сделке',
    description: Core.OperationReadMe('docs/deals/comment_create.md'),
  })
  async commentDeal(
    @Param('id') id: string,
    @Req() req: any,
    @Body() commentData: DealComment,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      userId: req.user.userID,
      comments: commentData.comments,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:comment', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Список сделок',
    description: Core.OperationReadMe('docs/deals/list.md'),
  })
  async listDeals(@MongoPaginationDecorator() pagination: MongoPagination): Promise<Core.Response.Answer> {
    const sendData = { pagination: pagination };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:list', sendData);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск сделки',
    description: Core.OperationReadMe('docs/deals/find.md'),
  })
  async findDeal(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:find', id);
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/:id/status')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация сделки',
    description: Core.OperationReadMe('docs/deals/archive.md'),
  })
  async archiveDeal(@Param('id') id: string, @Query('active') active: boolean): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
    };
    const response = await SendAndResponseData(this.dealsServiceClient, 'deals:archive', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:deals:upload', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:deals:list', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:deals:download', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:deals:delete', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:deals:avatar:show', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:deals:avatar:upload', sendData);
    this.logger.log(cyan(responseData));
    return responseData;
  }
}
