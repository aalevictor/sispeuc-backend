import { Module } from '@nestjs/common';
import { VistoriasService } from './vistorias.service';
import { VistoriasController } from './vistorias.controller';

@Module({
  controllers: [VistoriasController],
  providers: [VistoriasService],
})
export class VistoriasModule {}
