import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticationService } from '../../application/services/authentication.service';
import { User } from 'src/modules/users/domain/user.entity';
import { Public } from './decorators/public.decorator';
import { UserResponseDto } from 'src/modules/users/presenters/http/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Authentication')
@Controller('')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiCreatedResponse({
    description: 'User signed up successfully',
    type: AuthResponseDto,
  })
  @ApiBody({ type: SignupDto })
  async signup(@Body() signupDto: SignupDto) {
    const { accessToken, refreshToken, user } =
      await this.authenticationService.signUp(
        signupDto.email,
        signupDto.username,
        signupDto.password,
      );
    return AuthResponseDto.fromDomain({
      accessToken,
      refreshToken,
      user: UserResponseDto.fromDomain(user),
    });
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: AuthResponseDto,
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const { accessToken, refreshToken, user } =
      await this.authenticationService.login(loginDto.email, loginDto.password);
    return AuthResponseDto.fromDomain({
      accessToken,
      refreshToken,
      user: UserResponseDto.fromDomain(user),
    });
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

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'User profile retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  getProfile(@Request() req: Request & { user: User }) {
    return req.user;
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ description: 'User retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async getMe(
    @Request() req: Request & { user: { userId: string; email: string } },
  ) {
    const user = await this.authenticationService.getUser(req.user.userId);

    return UserResponseDto.fromDomain(user);
  }
}
