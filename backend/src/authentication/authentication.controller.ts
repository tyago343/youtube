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
} from '@nestjs/swagger';
import {
  SignupResponseDto,
  UserResponseDto,
} from '@users/dto/create-user.response';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Public()
  @ApiCreatedResponse({
    type: SignupResponseDto,
    description: 'The user has been successfully created',
  })
  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDto) {
    return this.authenticationService.signUp(signUpDto);
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  login(@Request() req: Request & { user: User }) {
    return this.authenticationService.login(req.user);
  }
  @UseGuards(LocalAuthenticationGuard)
  @Post('logout')
  logout(@Request() req: Request & { logout: () => void }) {
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
    return req.user;
  }
}
