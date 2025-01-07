import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { EmailModule } from "../email/email.module";
import { VerificationModule } from "../verification/verification.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '70000s' },
    }),
    EmailModule,
    VerificationModule
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
