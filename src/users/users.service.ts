import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDTO } from './createUserDTO';
import { UserResponse } from './user';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { LoginDTO } from './loginDTO';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(payload: CreateUserDTO): Promise<string> {
    if (await this.findUser(payload.email)) {
      throw new BadRequestException('Email already exists', {
        cause: new Error(),
        description: 'Email is already registered',
      });
    }

    payload.password = await this.encryptPSWD(payload.password, 10);
    if (!!(await this.prisma.user.create({ data: payload }))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Something went wrong', {
        cause: new Error(),
        description: 'Something really went wrong',
      });
    }
  }

  async findUser(email: string): Promise<UserResponse> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const user: UserResponse = await this.findUser(loginDTO.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await this.decryptPSWD(loginDTO.password, user.password))) {
      throw new UnauthorizedException('Something went wrong');
    }

    const accessToken: string = await this.jwtService.signAsync(
      {
        email: user.email,
        id: user.id,
      },
      {
        expiresIn: '1d',
      },
    );

    return { accessToken };
  }
  async encryptPSWD(plainText, saltRounds): Promise<string> {
    return await bcrypt.hash(plainText, saltRounds);
  }

  async decryptPSWD(plainText, hash): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
