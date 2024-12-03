import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

export class BaseGuard implements CanActivate {

  protected request;
  protected token: string;

  protected processToken(context: ExecutionContext): void {
    this.request = context.switchToHttp().getRequest();
    this.token = this.extractTokenFromHeader(this.request);
    if (!this.token) {
      throw new UnauthorizedException();
    }
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return undefined;
  }
}
