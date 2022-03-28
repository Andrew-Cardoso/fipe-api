import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignInDto } from './dtos/user-sign-in.dto';
import { UserSignUpDto } from './dtos/user-sign-up.dto';
import { VerificationDto } from './dtos/verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/verify-user')
  async verifyUser(@Query() { email, token }: VerificationDto) {
    return await this.authService.verifyUser(email, token);
  }

  @Post('/sign-in')
  async signInLocal(@Body() { email, password }: UserSignInDto) {
    return await this.authService.signInLocal(email, password);
  }

  @Post('/sign-up')
  async signUpLocal(@Body() userDto: UserSignUpDto) {
    return await this.authService.signUpLocal(userDto);
  }

  @Post('/send-verification-email')
  async sendVerificationEmail(@Body() { email, password }: UserSignInDto) {
    return await this.authService.checkUserAndSendVerificationEmail(
      email,
      password,
    );
  }
}
