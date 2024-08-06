import { Module } from '@nestjs/common';
import { GeosampaService } from './geosampa.service';
import { IntegracoesController } from './integracoes.controller';

@Module({
  controllers: [IntegracoesController],
  providers: [GeosampaService],
})
export class IntegracoesModule {}
