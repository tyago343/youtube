import {
  Controller,
  FileTypeValidator,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@authentication/decorators/authentication.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(FileInterceptor('avatar'))
  @Post(':id/upload-avatar')
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg)',
          }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @Param('id') id: string,
    @Request() req: Request & { user: { userId: string; email: string } },
  ) {
    if (req.user.userId !== id) {
      throw new ForbiddenException();
    }
    return this.usersService.uploadAvatar(id, avatar);
  }
  @Public()
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
