import { Module } from '@nestjs/common';
import { FolioController } from './folio.controller';
import { FolioService } from './folio.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FolioController],
  providers: [FolioService, PrismaService],
})
export class FolioModule {}
