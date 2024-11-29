import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { FolioService } from './folio.service';
import { AuthGuard } from '../users/auth/auth.guard';
import { FolioDTO } from './folioDTO';
import { FolioDataResponse } from './folio';

@Controller('api/v1/folio')
export class FolioController {
  constructor(private folioService: FolioService) {}

  @UseGuards(AuthGuard)
  @Get('/folios')
  async getFolios(@Request() req): Promise<FolioDataResponse> {
    return await this.folioService.getFolios(req.user.email);
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async createFolio(
    @Body() folioDTO: FolioDTO,
    @Request() req,
  ): Promise<string> {
    return await this.folioService.createFolio(folioDTO, req.user);
  }

  @UseGuards(AuthGuard)
  @Put('/update')
  async updateFolio(
    @Body() folioDTO: FolioDTO,
    @Request() req,
  ): Promise<string> {
    return await this.folioService.updateFolio(folioDTO, req.user);
  }
}
