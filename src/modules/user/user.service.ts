import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly mailService: MailService,
  ) {}

  async create(payload: RegisterDto): Promise<User> {
    const salt: string = await bcrypt.genSalt();
    const password: string = await bcrypt.hash(payload.password, salt);

    payload.password = password;

    const user = this.userRepository.create(payload);

    await this.userRepository.save(user);

    this.mailService.sendWelcomeMail(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }
}
