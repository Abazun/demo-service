import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FolioModule } from './folio/folio.module';

@Module({
  imports: [UsersModule, FolioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
