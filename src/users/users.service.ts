import {
  BadRequestException,
  Injectable,
  UnauthorizedException, UnprocessableEntityException
} from "@nestjs/common";
import { CreateUserDTO, FullUserDTO } from "./createUserDTO";
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { LoginDTO, OTPDTO } from "./loginDTO";
import { JwtService } from '@nestjs/jwt';
import { EmailService } from "../email/email.service";
import { VerificationService } from "../verification/verification.service";
import { UserResponse } from "./user";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private verifyService: VerificationService,
    private configService: ConfigService,
  ) {}

  async signup(payload: CreateUserDTO): Promise<{ accessToken: string }> {
    if (await this.findUser(payload.email)) {
      throw new BadRequestException('Email already exists', {
        cause: new Error(),
        description: 'Email is already registered',
      });
    }

    const finalPayload: FullUserDTO = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      createdAt: new Date(),
      accountStatus: 'inactive',
    }

    payload.password = await this.encryptPSWD(payload.password, 10);
    const user = await this.prisma.user.create({ data: finalPayload })

    if (!!user) {
      await this.generateEmailValidation(finalPayload);
      return this.createAccessToken(user);
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
    return this.createAccessToken(user);
  }

  async createAccessToken(user: UserResponse): Promise<{ accessToken: string }> {
    const accessToken: string = await this.jwtService.signAsync(
      {
        email: user.email,
        id: user.id,
        accountStatus: user.accountStatus
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
    return plainText === hash;

    // TODO - figure out why this broke all of a sudden
    // return await bcrypt.compare(plainText, hash);
  }

  async generateEmailValidation(userInfo): Promise<void> {
    const user: UserResponse = await this.findUser(userInfo.email);

    if (!await this.findUser(user.email)) {
      throw new BadRequestException('User does not exist', {
        cause: new Error(),
        description: 'Invalid Request',
      });
    }

    if (!!user.emailVerifiedAt) {
      throw new UnprocessableEntityException('Account already verified');
    }

    await this.sendEmailVerification(user);
  }

  async sendEmailVerification(user: UserResponse): Promise<void> {
    const otp: string = await this.verifyService.generateOtp(user.id);
    const link: string = this.configService.get<string>('HOST_URL');
    await this.emailService.sendEmail({
      subject: 'Eizyunga - Account Verification',
      recipients: [{ name: user.firstName, address: user.email }],
      html: `<p>Hi ${user.firstName},</p>
             <p>You may use the password below to verify your account using the following link: <a href="${link}/verify">${link}/verify</a><br />
             <span style="font-size:24px; font-weight: 700;">${otp}</span></p>`,
    });
  }

  async verifyEmail(userInfo, token: OTPDTO): Promise<{ accessToken: string }> {
    const invalidMessage: string = 'Invalid or expired transaction';

    if (!userInfo) {
      throw new UnprocessableEntityException('Invalid request');
    }

    const user: UserResponse = await this.findUser(userInfo.email);
    if (!user) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    if (user.emailVerifiedAt) {
      throw new UnprocessableEntityException('Account already verified');
    }

    const isValid: boolean = await this.verifyService.validateOtp(user.id, token.pass);

    if (!isValid) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    await this.prisma.user.update({
      where: {
        email: user.email
      },
      data: {
        emailVerifiedAt: new Date(),
        accountStatus: 'active'
      }
    });

    user.accountStatus = 'active';
    return this.createAccessToken(user);
  }
}
