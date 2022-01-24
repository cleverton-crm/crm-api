import {
  ApiBody,
  ApiConsumes,
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
import { CompanyDto, ResponseRecordsDataDto } from '../dto';
import { SendAndResponseData } from '../helpers/global';
import { Auth } from '../decorators/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileOptions } from '../helpers/file-options';
import { ApiPagination } from '../decorators/pagination.decorator';
import {
  MongoPagination,
  MongoPaginationDecorator,
} from '../decorators/mongo.pagination.decorator';

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
  @Post('/')
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
    if (ownerId) {
      companyData.owner = ownerId;
    } else {
      companyData.owner = req.user.userID;
    }
    const response = await SendAndResponseData(
      this.companyServiceClient,
      'company:create',
      companyData,
    );
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
   */
  @Patch('/:id')
  @ApiOperation({
    summary: 'Изменение данных о компании',
    description: Core.OperationReadMe('docs/company/update.md'),
  })
  @ApiQuery({ name: 'owner', required: false })
  async updateCompany(
    @Param('id') id: string,
    @Query('owner') ownerId: string,
    @Body() companyData: CompanyDto,
  ) {
    if (ownerId) {
      companyData.owner = ownerId;
    }
    const sendData = {
      id: id,
      data: companyData,
    };
    const response = await SendAndResponseData(
      this.companyServiceClient,
      'company:update',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * <<<<<<<<<<<<<<<<<<<<
   * Список всех компаний
   * <<<<<<<<<<<<<<<<<<<<
   */
  @Get('/')
  @ApiOperation({
    summary: 'Список всех компаний',
    description: Core.OperationReadMe('docs/company/list.md'),
  })
  @ApiPagination()
  async listCompanies(
    @MongoPaginationDecorator() pagination: MongoPagination,
  ): Promise<ResponseRecordsDataDto> {
    const response = await SendAndResponseData(
      this.companyServiceClient,
      'company:list',
      { pagination: pagination },
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * <<<<<<<<<<<<<<<<<<<<
   * Поиск одной компании
   * <<<<<<<<<<<<<<<<<<<<
   * @param id
   */
  @Get('/:id')
  @ApiOperation({
    summary: 'Поиск компании по ID',
    description: Core.OperationReadMe('docs/company/find.md'),
  })
  async findCompany(@Param('id') id: string) {
    const response = await SendAndResponseData(
      this.companyServiceClient,
      'company:find',
      id,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * Архивация компании
   * @param id
   * @param active
   */
  @Delete('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'Архивация компании',
    description: Core.OperationReadMe('docs/company/archive.md'),
  })
  async archiveCompany(
    @Param('id') id: string,
    @Query('active') active: boolean,
  ): Promise<Core.Response.Answer> {
    const sendData = {
      id: id,
      active: active,
    };
    const response = await SendAndResponseData(
      this.companyServiceClient,
      'company:archive',
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
  @ApiParam({ name: 'id', description: 'Укажите ID компании' })
  @ApiOperation({
    summary: 'Загрузка документов, файлов компании',
    description: Core.OperationReadMe('docs/clients/upload.md'),
  })
  @UseInterceptors(FilesInterceptor('file', 10, fileOptions))
  async upload(
    @UploadedFiles() file,
    @Param('id') company: string,
    @Req() req: any,
  ): Promise<any> {
    const response = [];
    file.forEach((file) => {
      response.push(file);
    });
    const sendData = {
      client: company,
      files: response,
      bucketName: 'company_' + company,
    };
    const responseData = await SendAndResponseData(
      this.filesServiceClient,
      'files:company:upload',
      sendData,
    );
    this.logger.log(cyan(responseData));
    return responseData;
  }
}
