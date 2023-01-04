import { Body, Controller, Post, ValidationPipe, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    request: RegisterDto,
  ): Promise<User> {
    return await this.userService.createUser(request);
  }
}
