import { Injectable } from '@nestjs/common';
import { AwsService } from './aws/aws.service';

@Injectable()
export class StorageService {
  constructor(private readonly awsService: AwsService) {}
  async uploadFile(file: Express.Multer.File, folder: string = '') {
    return this.awsService.uploadFile(file, folder);
  }
}
