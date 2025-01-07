import {
  Body,
  Controller,
  Post,
  Request, UseGuards
} from "@nestjs/common";
import { CreateUserDTO } from './createUserDTO';
import { UsersService } from './users.service';
import { LoginDTO, OTPDTO } from "./loginDTO";
import { VerificationGuard } from "../auth/guards/verification.guard";
import { apiRoutes } from "./constants";

@Controller(apiRoutes.user)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('signup')
  async create(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.signup(createUserDTO);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return await this.userService.login(loginDTO);
  }

  @UseGuards(VerificationGuard)
  @Post('verification')
  async generateEmailValidation(@Request() req) {
    await this.userService.generateEmailValidation(req);

    return { status: 'success', message: 'sending email' };
  }

  @UseGuards(VerificationGuard)
  @Post('verify')
  async verifyEmail(@Body() otp: OTPDTO, @Request() req) {
    return await this.userService.verifyEmail(req, otp);
  }
}
