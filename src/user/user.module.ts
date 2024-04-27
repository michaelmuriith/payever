import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './shemas/user.shema';
import { AvatarModule } from '../avatar/avatar.module';
import { AvatarService } from '@/avatar/avatar.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AvatarModule,
    AvatarService,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
