import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type( () => Number ) // equal to enableImplicitConversion en el global pipe
    limit?: number;


    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number;
}