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
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { cyan } from 'cli-color';
import { CompanyDto } from '../dto/company.dto';
import { SendAndResponseData } from '../helpers/global';
import { Auth } from '../decorators/auth.decorator';

@ApiTags('Companies')
@Auth('Admin', 'Manager')
@Controller('companies')
export class CompanyController {
  private logger: Logger;

  constructor(
    @Inject('COMPANY_SERVICE')
    private readonly companyServiceClient: ClientProxy,
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
    console.log(ownerId);
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
  async listCompanies() {
    const response = await SendAndResponseData(
      this.companyServiceClient,
      'company:list',
      true,
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
}
