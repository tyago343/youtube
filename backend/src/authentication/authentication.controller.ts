import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDto) {
    return this.authenticationService.signUp(signUpDto);
  }
}
