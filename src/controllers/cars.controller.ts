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
import { Core } from 'crm-core';
import { CarDto } from '../dto/car.dto';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { Auth } from '../decorators/auth.decorator';
import { ResponseSuccessDto, ResponseUnauthorizedDto } from '../dto';
import { fileImagesOptions } from '../helpers/file-images-options';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileOptions } from '../helpers/file-options';
import { ApiPagination } from '../decorators/pagination.decorator';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';

@ApiTags('Cars')
@Auth('Admin', 'Manager')
@Controller('cars')
export class CarsController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE') private readonly carsServiceClient: ClientProxy,
    @Inject('FILES_SERVICE')
    private readonly filesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(CarsController.name);
  }

  @Post('/create/:company')
  @ApiQuery({ name: 'owner', required: false })
  @ApiOperation({
    summary: 'Создание транспорта',
    description: Core.OperationReadMe('docs/cars/create.md'),
  })
  async createCar(
    @Param('company') company: string,
    @Query('owner') owner: string,
    @Req() req: any,
    @Body() carData: CarDto,
  ): Promise<any> {
    carData.owner = owner || req.user.userID;
    carData.company = company;
    const response = await SendAndResponseData(this.carsServiceClient, 'cars:create', carData);
    return response;
  }

  @Get('/list')
  @ApiOperation({
    summary: 'Список транспорта',
    description: Core.OperationReadMe('docs/cars/list.md'),
  })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'active', required: false, enum: ['true', 'false'] })
  @ApiPagination()
  async listCars(
    @Query('company') company: string,
    @MongoPaginationDecorator() pagination: MongoPagination,
    @Query('active') active: boolean = true,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    let response;
    let sendData = { pagination: pagination, req: req.user, active: active };
    if (company !== undefined) {
      sendData = Object.assign(sendData, { company: company });
    }
    response = await SendAndResponseData(this.carsServiceClient, 'cars:list', sendData);
    return response;
  }

  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск транспорта по ID',
    description: Core.OperationReadMe('docs/cars/find.md'),
  })
  async findCar(@Param('id') id: string, @Req() req: any): Promise<Core.Response.Answer> {
    let sendData = {
      id: id,
      req: req.user,
    };
    const response = await SendAndResponseData(this.carsServiceClient, 'cars:find', sendData);
    return response;
  }

  @Delete('/:id/archive')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация транспорта',
    description: Core.OperationReadMe('docs/cars/archive.md'),
  })
  async archiveCar(
    @Param('id') id: string,
    @Query('active') active: boolean,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      req: req.user,
      active: active,
    };
    const response = await SendAndResponseData(this.carsServiceClient, 'cars:archive', sendData);
    return response;
  }

  @Patch('/:id/update')
  @ApiQuery({ name: 'owner', required: false })
  @ApiQuery({ name: 'company', required: false })
  @ApiOperation({
    summary: 'Изменение данных транспорта',
    description: Core.OperationReadMe('docs/cars/update.md'),
  })
  async updateCar(
    @Param('id') id: string,
    @Query('company') company: string,
    @Query('owner') owner: string,
    @Body() carData: CarDto,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    carData.owner = owner || req.user.userID;
    if (company) {
      carData.company = company;
    }
    const sendData = {
      id: id,
      req: req.user,
      data: carData,
    };
    const response = await SendAndResponseData(this.carsServiceClient, 'cars:update', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:cars:upload', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:cars:list', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:cars:download', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:cars:delete', sendData);
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:cars:avatar:show', sendData);
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
  async uploadAvatar(@Req() req: any, @Param('id') id: string, @UploadedFiles() file): Promise<any> {
    const response = [];
    file.forEach((file) => {
      const fileResponse = {
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
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:cars:avatar:upload', sendData);
    return responseData;
  }
}
