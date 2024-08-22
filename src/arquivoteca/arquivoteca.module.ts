import { Module } from '@nestjs/common';
import { ArquivotecaService } from './arquivoteca.service';
import { ArquivotecaController } from './arquivoteca.controller';

@Module({
  controllers: [ArquivotecaController],
  providers: [ArquivotecaService],
})
export class ArquivotecaModule {}
