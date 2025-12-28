import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import {
  FileStorageService,
  UploadFileOptions,
  UploadResult,
} from '../../../application/ports/file-storage.interface';

@Injectable()
export class MinIOStorageService
  extends FileStorageService
  implements OnModuleInit
{
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly endpoint: string;
  private readonly port: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
    this.endpoint = this.configService.getOrThrow<string>('MINIO_ENDPOINT');
    this.port = this.configService.getOrThrow<string>('MINIO_PORT');

    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      forcePathStyle: true,
      endpoint: `http://${this.endpoint}:${this.port}`,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
        secretAccessKey:
          this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
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
    } catch {
      await this.s3Client.send(
        new CreateBucketCommand({ Bucket: this.bucketName }),
      );
      await this.setBucketPublicPolicy();
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
    options: UploadFileOptions = {},
  ): Promise<UploadResult> {
    const fileExtension = file.originalname.split('.').pop()!;
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = options.folder ? `${options.folder}/${fileName}` : fileName;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: options.contentType || file.mimetype,
        Metadata: options.metadata,
      }),
    );

    const url = `http://${this.endpoint}:${this.port}/${this.bucketName}/${key}`;

    return {
      url,
      key,
      bucket: this.bucketName,
    };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  getFileUrl(key: string): string {
    return `http://${this.endpoint}:${this.port}/${this.bucketName}/${key}`;
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }
}
