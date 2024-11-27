import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { UserResponse } from '../users/user';

@Injectable()
export class CommonService {
  constructor(
    private prisma: PrismaService,
  ) {
  }

  async findUser(email: string): Promise<UserResponse> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }
}
