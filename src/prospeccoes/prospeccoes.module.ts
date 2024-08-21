import { Module } from '@nestjs/common';
import { ProspeccoesService } from './prospeccoes.service';
import { ProspeccoesController } from './prospeccoes.controller';

@Module({
  controllers: [ProspeccoesController],
  providers: [ProspeccoesService],
})
export class ProspeccoesModule {}
