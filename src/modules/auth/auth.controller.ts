import { Controller, Request, Post, Get, UseGuards, Body, ValidationPipe, HttpStatus } from '@nestjs/common';
import { RegisterDto } from 'src/modules/user/dto/register.dto';
import { User } from 'src/modules/user/user.model';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() req: any): Promise<any> {
    return req.user;
  }

  @Post('register')
  async register(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    request: RegisterDto,
  ): Promise<User> {
    return await this.userService.create(request);
  }
}
