import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsService implements OnModuleInit {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(AwsService.name);

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow('MINIO_BUCKET');
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_REGION'),
      forcePathStyle: true,
      endpoint: `http://${this.configService.getOrThrow('MINIO_ENDPOINT')}:${this.configService.getOrThrow('MINIO_PORT')}`,
      credentials: {
        accessKeyId: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('MINIO_SECRET_KEY'),
      },
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.bucketName }),
      );
      this.logger.log(`Bucket "${this.bucketName}" already exists.`);
    } catch {
      this.logger.log(`Bucket "${this.bucketName}" not found. Creating...`);

      await this.s3Client.send(
        new CreateBucketCommand({ Bucket: this.bucketName }),
      );

      await this.setBucketPublicPolicy();

      this.logger.log(
        `Bucket "${this.bucketName}" created and configured as public.`,
      );
    }
  }

  private async setBucketPublicPolicy() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };

    await this.s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: this.bucketName,
        Policy: JSON.stringify(policy),
      }),
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = '',
  ): Promise<string> {
    const fileExtension = file.originalname.split('.').pop()!;

    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = folder ? `${folder}/${fileName}` : fileName;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    const publiUrl = `http://${this.configService.getOrThrow('MINIO_ENDPOINT')}:${this.configService.getOrThrow('MINIO_PORT')}/${this.bucketName}/${key}`;
    return publiUrl;
  }
}
