import { Module } from '@nestjs/common';
import { VistoriasService } from './vistorias.service';
import { VistoriasController } from './vistorias.controller';

import { SalvaguardaModule } from 'src/salvaguarda/salvaguarda.module';

@Module({
  imports: [SalvaguardaModule],
  controllers: [VistoriasController],
  providers: [VistoriasService],
})
export class VistoriasModule {}
