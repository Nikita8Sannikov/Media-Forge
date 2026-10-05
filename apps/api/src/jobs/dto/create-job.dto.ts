import { IsEnum, IsInt, Max, Min } from "class-validator";

export enum OutputFormat {
    JPEG = 'jpeg',
    PNG = 'png',
    WEBP = 'webp',
}

export class CreateJobDto {
    @IsInt()
    @Min(1)
    @Max(10000)
    width!: number;

    @IsInt()
    @Min(1)
    @Max(10000)
    height!: number;

    @IsEnum(OutputFormat)
    outputFormat!: OutputFormat;

    @IsInt()
    @Min(1)
    @Max(100)
    quality!: number;
}