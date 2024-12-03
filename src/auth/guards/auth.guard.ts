import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from '../../users/constants';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { BaseGuard } from "./base.guard";

@Injectable()
export class AuthGuard extends BaseGuard {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.processToken(context);
    this.request['user'] = await this.jwtService.verifyAsync(this.token, {
      secret: jwtConstants.secret,
    });

    if (this.request['user'].accountStatus === 'inactive') {
      throw new UnauthorizedException();
    }

    return true;
  }
}
