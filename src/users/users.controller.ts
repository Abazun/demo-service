import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDTO } from './createUserDTO';
import { UsersService } from './users.service';
import { LoginDTO } from './loginDTO';
import { AuthGuard } from './auth/auth.guard';

// TODO - common url prefix handled somewhere else
@Controller('api/v1/users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  async create(
    @Body()
    createUserDTO: CreateUserDTO,
  ) {
    return await this.userService.signup(createUserDTO);
  }

  @Post('/login')
  async login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return await this.userService.login(loginDTO);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
