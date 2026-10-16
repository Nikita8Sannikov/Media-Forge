import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class ObjectStorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const endpoint =
      this.configService.getOrThrow<string>('S3_ENDPOINT');

    const region =
      this.configService.getOrThrow<string>('S3_REGION');

    const accessKeyId =
      this.configService.getOrThrow<string>('S3_ACCESS_KEY');

    const secretAccessKey =
      this.configService.getOrThrow<string>('S3_SECRET_KEY');

    this.bucket =
      this.configService.getOrThrow<string>('S3_BUCKET');

    const forcePathStyle =
      this.configService.get<string>('S3_FORCE_PATH_STYLE') ===
      'true';

    this.client = new S3Client({
      endpoint,
      region,
      forcePathStyle,

      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async putObject(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await this.client.send(command);

    return key;
  }
}