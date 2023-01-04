import { Injectable } from '@nestjs/common';
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

  async createUser(payload: RegisterDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    payload.password = await bcrypt.hash(payload.password, salt);

    return this.userModel.create(payload);
  }

  async findUser(query: object): Promise<User | null> {
    return this.userModel.findOne(query);
  }
}
