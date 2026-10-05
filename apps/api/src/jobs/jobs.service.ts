import { Injectable } from '@nestjs/common';
import { CreateJobDto, OutputFormat } from './dto/create-job.dto.js';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

@Injectable()
export class JobsService {
  async create(dto: CreateJobDto, file: Express.Multer.File): Promise<Buffer> {
    console.log('[JobsService] processing started');

    console.log('[JobsService] received file:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // const job = {
    //   id: randomUUID(),
    //   status: 'created',
    //   params: dto,
    //   file: {
    //     originalName: file.originalname,
    //     mimetype: file.mimetype,
    //     size: file.size,
    //   },
    // };
    let image = sharp(file.buffer).resize({
        width: dto.width,
        height: dto.height,
        fit: 'inside',
        withoutEnlargement: true,
      });

      switch (dto.outputFormat) {
        case OutputFormat.JPEG:
          image = image.jpeg({
            quality: dto.quality,
          });
          break;
  
        case OutputFormat.PNG:
          image = image.png({
            quality: dto.quality,
          });
          break;
  
        case OutputFormat.WEBP:
          image = image.webp({
            quality: dto.quality,
          });
          break;
      }  

      const outputBuffer = await image.toBuffer();

      const metadata = await sharp(outputBuffer).metadata();

      console.log('[JobsService] output metadata:', {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: outputBuffer.length,
      });


    console.log('Buffer size:', file.buffer.length);
    console.log('First bytes:', file.buffer.subarray(0, 10));
    // console.log('[JobsService] job created:', job);

    console.log('[JobsService] processing completed');
    console.log('[JobsService] output size:', outputBuffer.length);
    // return job;

    return outputBuffer;
  }
}
