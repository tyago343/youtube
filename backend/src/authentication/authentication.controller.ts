import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('signup')
  async signUp(@Body() signUpDto: any) {
    return this.authenticationService.signUp(signUpDto);
  }
}
