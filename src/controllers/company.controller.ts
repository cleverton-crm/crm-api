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
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { cyan } from 'cli-color';
import { CompanyDto } from '../dto/company.dto';

@ApiTags('Companies')
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
   * Создание компании
   * @param companyData
   */
  @Post('/')
  @ApiOperation({
    summary: 'Создание компании',
    description: Core.OperationReadMe('docs/company/create.md'),
  })
  @ApiResponse({ type: CompanyDto, status: HttpStatus.OK })
  async createCompany(
    @Body() companyData: CompanyDto,
  ): Promise<Core.Response.Answer> {
    const response = await Core.SendAndResponse(
      this.companyServiceClient,
      'company:create',
      companyData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Список всех компаний',
    description: Core.OperationReadMe('docs/company/list.md'),
  })
  async listCompanies() {
    const response = await Core.SendAndResponse(
      this.companyServiceClient,
      'company:list',
      true,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Поиск компании по ID',
    description: Core.OperationReadMe('docs/company/find.md'),
  })
  async findCompany(@Param('id') id: string) {
    const response = await Core.SendAndResponse(
      this.companyServiceClient,
      'company:find',
      id,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * Создание компании
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
    const response = await Core.SendAndResponse(
      this.companyServiceClient,
      'company:archive',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
