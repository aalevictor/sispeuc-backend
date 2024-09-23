import { Module } from '@nestjs/common';
import { RelacionamentosService } from './relacionamentos.service';
import { RelacionamentosController } from './relacionamentos.controller';

@Module({
  controllers: [RelacionamentosController],
  providers: [RelacionamentosService],
})
export class RelacionamentosModule {}
