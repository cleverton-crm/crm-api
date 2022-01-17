import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { NewsCommentDto, NewsDto, NewsUpdateDto } from '../dto/news.dto';
import { Core } from 'crm-core';
import { SendAndResponseData } from '../helpers/global';
import { cyan } from 'cli-color';
import { DealHistory } from '../dto';

@ApiTags('News')
@Auth('Admin', 'Manager')
@Controller('news')
export class NewsController {
  private logger: Logger;

  constructor(
    @Inject('NEWS_SERVICE') private readonly newsServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(NewsController.name);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Создание новости',
    description: Core.OperationReadMe('docs/news/create.md'),
  })
  async createNews(
    @Req() req: any,
    @Body() newsData: NewsDto,
  ): Promise<Core.Response.Answer> {
    newsData.author = req.user.userID;
    const response = await SendAndResponseData(
      this.newsServiceClient,
      'news:create',
      newsData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/update')
  @ApiOperation({
    summary: 'Редактирование новости',
    description: Core.OperationReadMe('docs/news/update.md'),
  })
  async updateNews(
    @Param('id') id: string,
    @Body() newsData: NewsUpdateDto,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      data: newsData,
    };
    const response = await SendAndResponseData(
      this.newsServiceClient,
      'news:update',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/comment')
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
      userId: req.user.userID,
      comments: commentData.comments,
    };
    const response = await SendAndResponseData(
      this.newsServiceClient,
      'news:comment',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Список новостей',
    description: Core.OperationReadMe('docs/news/list.md'),
  })
  async listNews(): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.newsServiceClient,
      'news:list',
      true,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/:id/find')
  @ApiOperation({
    summary: 'Поиск новости',
    description: Core.OperationReadMe('docs/news/find.md'),
  })
  async findNews(@Param('id') id: string): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.newsServiceClient,
      'news:find',
      id,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Delete('/:id/status')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация новости',
    description: Core.OperationReadMe('docs/news/archive.md'),
  })
  async archiveNews(
    @Param('id') id: string,
    @Query('active') active: boolean,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
    };
    const response = await SendAndResponseData(
      this.newsServiceClient,
      'news:archive',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
