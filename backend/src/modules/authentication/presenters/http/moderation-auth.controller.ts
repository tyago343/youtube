import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case';
import { ModerationLoginUseCase } from '../../application/use-cases/moderation-login.use-case';
import { UserResponseDto } from 'src/modules/users/presenters/http/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { Public } from './decorators/public.decorator';
import { AuthenticationService } from '../../application/services/authentication.service';

@ApiTags('Moderation Authentication')
@Controller('moderation/auth')
export class ModerationAuthController {
  constructor(
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly moderationLoginUseCase: ModerationLoginUseCase,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login to moderation hub',
    description:
      'Authenticate with the same credentials as the main app. Only users with MODERATOR or LEGAL role can access.',
  })
  @ApiOkResponse({
    description: 'User logged in successfully to moderation hub',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiForbiddenResponse({
    description: 'User does not have MODERATOR or LEGAL role',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUserUseCase.execute(
      loginDto.email,
      loginDto.password,
    );
    const {
      accessToken,
      refreshToken,
      user: authenticatedUser,
    } = await this.moderationLoginUseCase.execute(user);

    return AuthResponseDto.fromDomain({
      accessToken,
      refreshToken,
      user: UserResponseDto.fromDomain(authenticatedUser),
    });
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get current moderator user',
    description:
      'Returns the current authenticated user. Requires a valid JWT access token.',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
  })
  async getMe(
    @Request() req: Request & { user: { userId: string; email: string } },
  ) {
    const user = await this.authenticationService.getUser(req.user.userId);
    return UserResponseDto.fromDomain(user);
  }
}
