import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarSchema } from './schemas/avatar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Avatar', schema: AvatarSchema }]),
  ],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class AvatarModule {}
