import {Core} from "crm-core";
import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";

export class SettingsDto implements Core.Settings.Schema{
    @ApiProperty({default: 'Количество страницы при выводе'})
    name: string;

    @ApiProperty({default:'number'})
    type: string;

    @ApiProperty({ description: 'Укажите объект к которому будет относится данное поле', example:'company'})
    object: string;

    @ApiProperty({default:'limit'})
    property: string;

    @ApiProperty()
    @IsOptional()
    vArray?: Array<any>;

    @ApiProperty()
    @IsOptional()
    vBoolean?: boolean;

    @ApiProperty()
    @IsOptional()
    vMap?: Map<string, any>;

    @ApiProperty()
    @IsOptional()
    vNumber?: number;

    @ApiProperty()
    @IsOptional()
    vString?: string;
}
export  class ListSettingsDto {
    @ApiProperty({default: 'Количество страницы при выводе'})
    name: string;

    @ApiProperty({default:'number'})
    type: string;

    @ApiProperty({ description: 'Укажите объект к которому будет относится данное поле', example:'company'})
    object: string;

    @ApiProperty({default:'limit'})
    property: string;
}