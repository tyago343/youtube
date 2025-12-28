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

@ApiTags('Authentication')
@Controller('')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiCreatedResponse({ description: 'User signed up successfully' })
  @ApiBody({ type: SignupDto })
  async signup(@Body() signupDto: SignupDto) {
    const { accessToken, user } = await this.authenticationService.signUp(
      signupDto.email,
      signupDto.username,
      signupDto.password,
    );
    return {
      accessToken,
      user: UserResponseDto.fromDomain(user),
    };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const { accessToken, user } = await this.authenticationService.login(
      loginDto.email,
      loginDto.password,
    );
    return {
      accessToken,
      user: UserResponseDto.fromDomain(user),
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiOkResponse({ description: 'User logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  logout(@Request() req: Request & { logout: () => void }) {
    return req.logout();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'User profile retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  getProfile(@Request() req: Request & { user: User }) {
    return req.user;
  }
}
