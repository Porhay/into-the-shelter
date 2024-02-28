import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { updateUserRequest } from 'apps/shelter-accounts/src/users/dto/updateUser.request';

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) { }

  async createUser(user: { email: string, displayName: string }) {
    return this.prisma.users.create({
      data: user,
    });
  }

  async updateUser(userId: number, data: updateUserRequest) {
    return await this.prisma.users.update({
      where: { id: userId }, data: data
    })
  }

  async deleteUser(userId: number) {
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

  async getUserById(userId: number) {
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
}