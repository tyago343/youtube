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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UploadAvatarResponseDto } from './dto/upload-avatar.response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(FileInterceptor('avatar'))
  @Post(':id/upload-avatar')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'The avatar image',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload avatar for a user',
    description: 'Upload an avatar image for a user. Requires valid JWT token.',
  })
  @ApiOkResponse({
    description: 'Avatar uploaded successfully',
    type: UploadAvatarResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing authentication token',
  })
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
  ): Promise<UploadAvatarResponseDto> {
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
