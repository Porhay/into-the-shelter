import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { updateUserRequest } from 'apps/shelter-accounts/src/users/dto/updateUser.request';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) { }

  //  -----------
  //  USERS TABLE
  //  -----------

  async createUser(user: CreateUserDto) {
    return this.prisma.users.create({
      data: user,
    });
  }

  async updateUser(userId: string, data: updateUserRequest) {
    return await this.prisma.users.update({
      where: { id: userId }, data: data
    })
  }

  async deleteUser(userId: string) {
    // Check if the user exists
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Delete the user
    return this.prisma.users.delete({
      where: { id: userId },
    });
  }

  async getUserById(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      new Error(`User with email ${email} not found`);
    }

    return user || null;
  }


  //  -----------
  //  FILES TABLE
  //  -----------

  async createFile(file: CreateFileDto) {
    return this.prisma.files.create({
      data: file,
    });
  }

  async deleteFile(fileId: string) {
    const file = await this.prisma.files.findUnique({ where: { id: fileId } });
    if (!file) {
      throw new Error(`File with ID ${fileId} not found`);
    }

    return this.prisma.files.delete({
      where: { id: fileId },
    });
  }

  async getFileById(fileId: string) {
    const file = await this.prisma.files.findUnique({ where: { id: fileId } });
    if (!file) {
      throw new Error(`File with ID ${fileId} not found`);
    }
    return file;
  }

  async getFilesByUserId(userId: string, type: string = null) {
    const files = await this.prisma.files.findMany({ where: { userId: userId, type: type } });
    if (!files) {
      return null
    }
    return files;
  }
}