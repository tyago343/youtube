import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/create-user.request.dto';
import { User } from '@users/entities/users.entity';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { JwtAuthGuard } from './guards/jwt-authentication.guard';
import { Public } from '@authentication/decorators/authentication.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginResponseDto,
  SignupResponseDto,
  UserResponseDto,
} from '@users/dto/create-user.response';
import { LoggerService } from '../logger/logger.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly logger: LoggerService,
    private readonly authenticationService: AuthenticationService,
  ) {}
  @Public()
  @ApiCreatedResponse({
    type: SignupResponseDto,
    description: 'The user has been successfully created',
  })
  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDto) {
    this.logger.info('POST /auth/signup - New signup request received');
    return this.authenticationService.signUp(signUpDto);
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'The email of the user' },
        password: { type: 'string', description: 'The password of the user' },
      },
    },
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  @Post('login')
  login(@Request() req: Request & { user: User }) {
    this.logger.info(
      '{ userId: req.user.id }',
      'POST /auth/login - Login request received',
    );
    return this.authenticationService.login(req.user);
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout a user',
    description: 'Logs out a user and invalidates the JWT token',
  })
  @ApiOkResponse({
    description: 'User logged out successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing authentication token',
  })
  @Post('logout')
  logout(@Request() req: Request & { logout: () => void; user?: User }) {
    this.logger.info(
      '{ userId: req.user?.id  }',
      'POST /auth/logout - User logged out',
    );
    return req.logout();
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Returns the profile information of the currently authenticated user. Requires valid JWT token.',
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing authentication token',
  })
  getProfile(@Request() req: Request & { user: User }) {
    this.logger.debug(
      '{ userId: req.user.id }',
      'GET /auth/profile - Profile retrieved',
    );
    return req.user;
  }
}
