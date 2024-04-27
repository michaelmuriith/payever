import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './shemas/user.shema';
import mongoose from 'mongoose';
import axios from 'axios';
import { Avatar } from '../avatar/schemas/avatar.schema';
import { AvatarService } from '../avatar/avatar.service';

@Injectable()
export class UserService {
  // private channelWrapper: ChannelWrapper;

  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private avatarService: AvatarService,
  ) {}

  //create user
  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();

    // Emit rabbitMQ event
    //this.channelWrapper.sendToQueue('userEvents', { action: 'user_created', user: savedUser });

    // Dummy email sending
    console.log(`Email sent to ${savedUser.email}`);

    return savedUser;
  }

  //find user by id from https://reqres.in/api/users/{userId}
  async findById(userId: number): Promise<JSON> {
    try {
      const response = await axios.get(`https://reqres.in/api/users/${userId}`);
      if (response.status !== 200)
        throw new Error(`User with ID ${userId} not found or request failed`);
      else return response.data.data;
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new Error(`User with ID ${userId} not found or request failed`);
    }
  }

  //get user's avatar
  async getUserAvatar(userId: number): Promise<Avatar> {
    //get user avatart from avatar service
    return await this.avatarService.getAvatarByUserId(userId);
  }

  //delete user's avatar from db and file
  async deleteUserAvatar(userId: number): Promise<void> {
    //delete user avatar from avatar service
    await this.avatarService.deleteAvatar(userId);
  }
}
