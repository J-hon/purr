import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(payload: RegisterDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    payload.password = await bcrypt.hash(payload.password, salt);

    return await this.userModel.create(payload);
  }

  async find(query: object): Promise<User | undefined> {
    const user = await this.userModel.findOne(query).exec();
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }
}
