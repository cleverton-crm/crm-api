import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, HttpStatus, Inject, Logger, Post} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {Core} from "crm-core";
import { cyan } from 'cli-color';
import {CompanyDto} from "../dto/company.dto";

@ApiTags('Clients')
@Controller('clients')
export class CompanyController {
    private logger: Logger;

    constructor(
        @Inject('COMPANY_SERVICE')
        private readonly companyServiceClient: ClientProxy,
    ) {
        this.logger = new Logger(CompanyController.name);
    }

    /**
     * Создание сомпании
     * @param companyData
     */
    @Post('/')
    @ApiOperation({
        summary: 'Создание клиента компании',
        description: Core.OperationReadMe('docs/company/create.md'),
    })
    @ApiResponse({ type: CompanyDto, status: HttpStatus.OK })
    async createPersona(
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
}