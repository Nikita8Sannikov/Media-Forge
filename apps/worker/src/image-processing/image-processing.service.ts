import { Injectable } from '@nestjs/common';
import { ImageProcessingOptions } from './image-processing.types.js';
import sharp from 'sharp';

@Injectable()
export class ImageProcessingService {
  async process(
    inputBuffer: Buffer,
    options: ImageProcessingOptions,
  ): Promise<Buffer> {
    let image = sharp(inputBuffer).resize({
      width: options.width,
      height: options.height,
      fit: 'inside',
      withoutEnlargement: true,
    });

    switch (options.outputFormat) {
      case 'jpeg':
        image = image.jpeg({
          quality: options.quality,
        });
        break;

      case 'png':
        image = image.png();
        break;

      case 'webp':
        image = image.webp({
          quality: options.quality,
        });
        break;
    }

    const outputBuffer = await image.toBuffer();

    const metadata = await sharp(outputBuffer).metadata();

    console.log('[Worker] output metadata:', {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: outputBuffer.length,
    });

    return outputBuffer;
  }
}
