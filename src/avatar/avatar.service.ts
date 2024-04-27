import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Avatar } from './schemas/avatar.schema';
import { Model } from 'mongoose';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name)
    private avatarModel: Model<Avatar>,
  ) {}

  // Common function to get the avatar directory
  private getAvatarDir(): string {
    const baseDir = path.resolve(__dirname, '../..'); // Project's root
    return path.join(baseDir, 'storage', 'avatars');
  }

  // Function to get the avatar file path based on userId
  private getAvatarFilePath(userId: number): string {
    const avatarDir = this.getAvatarDir(); // Get the avatar directory
    return path.join(avatarDir, `${userId}.jpg`); // File path for the avatar
  }

  async saveAvatar(userId: number): Promise<Avatar> {
    try {
      const avatarDir = this.getAvatarDir(); // Get avatar storage directory

      // Ensure the avatar directory exists
      if (!fs.existsSync(avatarDir)) {
        fs.mkdirSync(avatarDir, { recursive: true }); // Create directory if missing
      }

      const avatarFilePath = this.getAvatarFilePath(userId); // Get the file path

      // Fetch avatar from external source
      const response = await axios.get(`https://reqres.in/api/users/${userId}`);
      const avatarUrl = response.data.data.avatar;

      const avatarData = await axios.get(avatarUrl, {
        responseType: 'arraybuffer',
      });

      // Write the avatar data to the file
      fs.writeFileSync(avatarFilePath, avatarData.data);

      // Convert data to base64 for storage in the database
      const base64Data = Buffer.from(avatarData.data).toString('base64');

      // Create the avatar document in MongoDB
      const avatar = await this.avatarModel.create({
        userId: String(userId), // Ensure correct data type
        base64: base64Data, // Base64 representation of the avatar image
      });

      return avatar; // Return the newly created avatar
    } catch (error) {
      console.error(`Error in saveAvatar: ${error.message}`);
      throw new BadRequestException('Could not save avatar'); // Handle error
    }
  }

  async getAvatarByUserId(userId: number): Promise<Avatar> {
    // Check if the avatar already exists in the database
    const avatar = await this.avatarModel.findOne({ userId }).exec();

    if (avatar) {
      return avatar; // Return the existing avatar
    } else {
      // If not found, save a new avatar
      return await this.saveAvatar(userId);
    }
  }

  async deleteAvatar(userId: number): Promise<void> {
    try {
      const avatarFilePath = this.getAvatarFilePath(userId); // Get the file path

      // Find the avatar record in the database
      const avatar = await this.avatarModel.findOne({ userId }).exec();

      if (!avatar) {
        throw new BadRequestException('Avatar not found'); // Handle missing avatar
      }

      // If the file exists, delete it
      if (fs.existsSync(avatarFilePath)) {
        fs.unlinkSync(avatarFilePath); // Delete the file
      } else {
        console.warn(`Avatar file not found: ${avatarFilePath}`); // Log a warning
      }

      // Delete the avatar document from MongoDB
      await this.avatarModel.deleteOne({ _id: avatar._id });
    } catch (error) {
      console.error(`Error in deleteAvatar: ${error.message}`); // Log error
      throw new BadRequestException('Could not delete avatar'); // Handle failure
    }
  }
}
