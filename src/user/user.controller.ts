import { Avatar } from 'src/avatar/schemas/avatar.schema';
import { User } from './shemas/user.shema';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  //create user
  @Post('users')
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  // get user byd id
  @Get('user/:userId')
  async findById(@Param('userId') userId: number): Promise<JSON> {
    return this.userService.findById(userId);
  }

  // get user's avatar
  @Get('user/:userId/avatar')
  async getAvatar(@Param('userId') userId: number): Promise<Avatar> {
    return await this.userService.getUserAvatar(userId);
  }

  // delete user's avatar from db and file
  @Delete('user/:userId/avatar')
  async deleteAvatar(@Param('userId') userId: number): Promise<any> {
    await this.userService.deleteUserAvatar(userId);
    return {
      message: 'Avatar deleted successfully',
    };
  }
}
