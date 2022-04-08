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
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { NewsCommentDto, NewsDto, NewsUpdateDto } from '../dto';
import { Core } from 'crm-core';
import { SendAndResponseData } from '../helpers/global';
import { ResponseSuccessDto, ResponseUnauthorizedDto } from '../dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileImagesOptions } from '../helpers/file-images-options';
import { ApiPagination } from '../decorators/pagination.decorator';
import { MongoPagination, MongoPaginationDecorator } from '../decorators/mongo.pagination.decorator';

@ApiTags('News')
@Auth('Admin', 'Manager')
@Controller('news')
export class NewsController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE') private readonly newsServiceClient: ClientProxy,
    @Inject('FILES_SERVICE')
    private readonly filesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(NewsController.name);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Создание новости',
    description: Core.OperationReadMe('docs/news/create.md'),
  })
  async createNews(@Req() req: any, @Body() newsData: NewsDto): Promise<Core.Response.Answer> {
    const sendData = {
      data: newsData,
      req: req.user,
    };
    const response = await SendAndResponseData(this.newsServiceClient, 'news:create', sendData);
    return response;
  }

  @Patch('/update/:id')
  @ApiOperation({
    summary: 'Редактирование новости',
    description: Core.OperationReadMe('docs/news/update.md'),
  })
  async updateNews(
    @Param('id') id: string,
    @Body() newsData: NewsUpdateDto,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      data: newsData,
      req: req.user,
    };
    const response = await SendAndResponseData(this.newsServiceClient, 'news:update', sendData);
    return response;
  }

  @Patch('/comment/:id')
  @ApiOperation({
    summary: 'Добавление комментария к новости',
    description: Core.OperationReadMe('docs/news/comment_create.md'),
  })
  async commentNews(
    @Param('id') id: string,
    @Req() req: any,
    @Body() commentData: NewsCommentDto,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      req: req.user,
      comments: commentData.comments,
    };
    const response = await SendAndResponseData(this.newsServiceClient, 'news:comment', sendData);
    return response;
  }

  @Get('/list')
  @ApiOperation({
    summary: 'Список новостей',
    description: Core.OperationReadMe('docs/news/list.md'),
  })
  @ApiQuery({ name: 'active', required: false, enum: ['true', 'false'] })
  @ApiPagination()
  async listNews(
    @MongoPaginationDecorator() pagination: MongoPagination,
    @Query('active') active: boolean = true,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      pagination: pagination,
      active: active,
    };
    const response = await SendAndResponseData(this.newsServiceClient, 'news:list', sendData);
    return response;
  }

  @Get('/find/:id')
  @ApiOperation({
    summary: 'Поиск новости',
    description: Core.OperationReadMe('docs/news/find.md'),
  })
  async findNews(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(this.newsServiceClient, 'news:find', id);
    return response;
  }

  /**
   * Загрузка фото для новости
   * @param id
   * @param file
   * @param req
   */
  @Post('/announcement/upload/:id')
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
    summary: 'Загрузка фото для новости',
    description: Core.OperationReadMe('docs/files/upload.md'),
  })
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @UseInterceptors(FilesInterceptor('file', 1, fileImagesOptions))
  async uploadNewsPicture(@Req() req: any, @Param('id') id: string, @UploadedFiles() file): Promise<any> {
    const response = [];
    file.forEach((file) => {
      response.push(file);
    });
    const sendData = { owner: req.user.userID, files: response, id: id };
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:news:avatar:upload', sendData);
    return responseData;
  }

  /**
   * Получение аватара по авторизации
   * @param req
   * @param id
   */
  @Get('/announcement/show/:id')
  @ApiOperation({
    summary: 'Фото новости',
    description: Core.OperationReadMe('docs/files/show_news_photo.md'),
  })
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  async showAvatar(@Req() req: any, @Param('id') id: string): Promise<Core.Response.Answer | Core.Response.Error> {
    const sendData = { owner: req.user, id: id };
    const responseData = await SendAndResponseData(this.filesServiceClient, 'files:news:avatar:show', sendData);
    return responseData;
  }

  @Delete('/archive/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация новости',
    description: Core.OperationReadMe('docs/news/archive.md'),
  })
  async archiveNews(
    @Param('id') id: string,
    @Query('active') active: boolean,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
      req: req.user,
    };
    const response = await SendAndResponseData(this.newsServiceClient, 'news:archive', sendData);
    return response;
  }
}
