import { Module } from '@nestjs/common';
import { SalvaguardaService } from './salvaguarda.service';
import { SalvaguardaController } from './salvaguarda.controller';

@Module({
  controllers: [SalvaguardaController],
  providers: [SalvaguardaService],
  exports: [SalvaguardaService],
})
export class SalvaguardaModule {}
