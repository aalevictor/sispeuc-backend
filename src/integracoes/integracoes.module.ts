import { Module } from '@nestjs/common';
import { IntegracoesGeosampaService } from './integracoes-geosampa.service';
import { IntegracoesGeosampaController } from './integracoes.controller';

@Module({
  controllers: [IntegracoesGeosampaController],
  providers: [IntegracoesGeosampaService],
})
export class IntegracoesModule {}
