import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.model';


@Injectable()
export class DatabaseService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    fn(): string {
        return 'DatabaseService'
    }

    

  async createUser(user: User): Promise<UserDocument> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async getUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
}


