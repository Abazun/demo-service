import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { PrismaService } from "../prisma.service";

@Injectable()
export class VerificationService {
  private readonly tokenExpirationMinutes = 15;
  private readonly saltRounds = 10;

  constructor(
    private prisma: PrismaService,
  ) {}

  async generateOtp(userId: number, size: number = 6): Promise<string> {
    const now: Date = new Date();
    const otp: string = this.createOtp(size);
    const hashedToken = await bcrypt.hash(otp, this.saltRounds);

    if (await this.prisma.otpToken.create({
      data: {
        userId: userId,
        token: hashedToken,
        expiresAt: new Date(now.getTime() + this.tokenExpirationMinutes * 60 * 1000)
      }
    })) {
      return otp;
    } else {
      throw new UnauthorizedException('Something went wrong', {
        cause: new Error(),
        description: 'Something really went wrong',
      });
    }
  }

  async validateOtp(userId: number, token: string): Promise<boolean> {
    const validToken = await this.prisma.otpToken.findFirst({
      where: { userId },
    });

    if (validToken && (await bcrypt.compare(token, validToken.token))) {
      await this.prisma.otpToken.deleteMany({
        where: {
          userId: userId
        }
      });
      return true;
    } else {
      return false;
    }
  }

  createOtp = (size: number = 6): string =>
     (crypto.getRandomValues(new Uint32Array(1))[0] % Math.pow(10, size)).toString().padStart(size, '0');
}
