import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '@authentication/decorators/authentication.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @UseInterceptors(FileInterceptor('avatar'))
  @Post(':id/upload-avatar')
  uploadAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.usersService.uploadAvatar(id, avatar);
  }
}
