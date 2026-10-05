import { Type } from "class-transformer";
import { IsEnum, IsInt, Max, Min } from "class-validator";
import { ImageOutputFormat } from "../../image-processing/image-processing.types.js";

export class CreateJobDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(10000)
    width!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(10000)
    height!: number;

    @IsEnum(ImageOutputFormat)
    outputFormat!: ImageOutputFormat;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    quality!: number;
}