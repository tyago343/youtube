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
import { UserResponseDto } from 'src/modules/users/presenters/http/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { Public } from './decorators/public.decorator';
import { AuthenticationService } from '../../application/services/authentication.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Moderation Authentication')
@Controller('moderation/auth')
export class ModerationAuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

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
  @ApiForbiddenResponse({
    description: 'User does not have MODERATOR or LEGAL role',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const { user, accessToken, refreshToken } =
      await this.authenticationService.loginModeration(
        loginDto.email,
        loginDto.password,
      );

    return AuthResponseDto.fromDomain({
      accessToken,
      refreshToken,
      user: UserResponseDto.fromDomain(user),
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

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const { accessToken, refreshToken } =
      await this.authenticationService.refreshToken(
        refreshTokenDto.refreshToken,
      );
    return {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    };
  }
}
