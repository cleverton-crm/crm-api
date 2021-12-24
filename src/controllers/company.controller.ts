import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
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
  /**
   * Создание компании
   * @param id
   * @param active
   */
  @Delete('/:id')
  @ApiOperation({
    summary: 'Архивация компании',
    description: Core.OperationReadMe('docs/company/archive.md'),
  })
  @ApiResponse({ type: CompanyDto, status: HttpStatus.OK })
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
