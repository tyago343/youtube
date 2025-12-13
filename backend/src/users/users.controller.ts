import {
  Controller,
  ForbiddenException,
  Get,
  Param,
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
    @UploadedFile() avatar: Express.Multer.File,
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
