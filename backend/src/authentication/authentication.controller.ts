import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { User } from '@users/entities/users.entity';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { JwtAuthGuard } from './guards/jwt-authentication.guard';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDto) {
    return this.authenticationService.signUp(signUpDto);
  }
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
  getProfile(@Request() req: Request & { user: User }) {
    return req.user;
  }
}
