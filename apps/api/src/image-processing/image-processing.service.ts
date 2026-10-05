import { Injectable } from '@nestjs/common';
import {
  ImageOutputFormat,
  ImageProcessingOptions,
} from './image-processing.types.js';
import sharp from 'sharp';

@Injectable()
export class ImageProcessingService {
  async process(inputBuffer: Buffer, options: ImageProcessingOptions): Promise<Buffer>  {

    console.log('[3] ImageProcessingService.process()');

    let image = sharp(inputBuffer).resize({
      width: options.width,
      height: options.height,
      fit: 'inside',
      withoutEnlargement: true,
    });

    switch (options.outputFormat) {
      case ImageOutputFormat.JPEG:
        image = image.jpeg({
          quality: options.quality,
        });
        break;

      case ImageOutputFormat.PNG:
        image = image.png({
          quality: options.quality,
        });
        break;

      case ImageOutputFormat.WEBP:
        image = image.webp({
          quality: options.quality,
        });
        break;
    }

    const outputBuffer = await image.toBuffer();

    console.log('[4] Sharp finished');

    const metadata = await sharp(outputBuffer).metadata();

    console.log('[JobsService] output metadata:', {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: outputBuffer.length,
    });

    console.log('Buffer size:', inputBuffer.length);
    console.log('First bytes:', inputBuffer.subarray(0, 10));

    console.log('[JobsService] processing completed');
    console.log('[JobsService] output size:', outputBuffer.length);

    return outputBuffer;
  }
}
