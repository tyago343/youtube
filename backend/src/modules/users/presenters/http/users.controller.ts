import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '@authentication/decorators/authentication.decorator';

import { UsersService } from '../../application/services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UploadAvatarResponseDto } from './dto/upload-avatar-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(
      dto.email,
      dto.username,
      dto.password,
    );
    return UserResponseDto.fromDomain(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID or email' })
  @ApiOkResponse({
    description: 'User found',
    type: UserResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return UserResponseDto.fromDomain(user);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all users (public endpoint)',
    description: 'Public endpoint for testing. Will be removed.',
  })
  @ApiOkResponse({
    description: 'Users fetched successfully',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => UserResponseDto.fromDomain(user));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing authentication token',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: Request & { user: { userId: string } },
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, dto, req.user.userId);
    return UserResponseDto.fromDomain(user);
  }

  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
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
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg)',
          }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @Param('id') id: string,
    @Request() req: Request & { user: { userId: string } },
  ): Promise<UploadAvatarResponseDto> {
    return await this.usersService.uploadAvatar(id, avatar, req.user.userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({
    description: 'User deleted successfully',
  })
  async delete(
    @Param('id') id: string,
    @Request() req: Request & { user: { userId: string } },
  ): Promise<void> {
    await this.usersService.delete(id, req.user.userId);
  }
}
