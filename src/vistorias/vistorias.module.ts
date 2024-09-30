import { Module } from '@nestjs/common';
import { VistoriasService } from './vistorias.service';
import { VistoriasController } from './vistorias.controller';
import { SalvaguardaService } from 'src/salvaguarda/salvaguarda.service';

@Module({
  controllers: [VistoriasController],
  providers: [VistoriasService, SalvaguardaService],
})
export class VistoriasModule {}
