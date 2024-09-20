import { Module } from '@nestjs/common';
import { BuscasService } from './buscas.service';
import { BuscasController } from './buscas.controller';
import { VistoriaBuscaStrategy } from './strategies/vistoria-busca.strategy';
import { ProcessoBuscaStrategy } from './strategies/processo-busca.strategy';
import { ImovelBuscaStrategy } from './strategies/imovel-busca.strategy';
import { ImovelBuscaTextoStrategy } from './strategies/imovel-busca-texto.strategy';
import { ProcessoBuscaTextoStrategy } from './strategies/processo-busca-texto.strategy';
import { VistoriaBuscaTextoStrategy } from './strategies/vistoria-busca-texto.strategy';

@Module({
  imports: [],
  controllers: [BuscasController],
  providers: [
    BuscasService,
    VistoriaBuscaStrategy,
    VistoriaBuscaTextoStrategy,
    ProcessoBuscaStrategy,
    ProcessoBuscaTextoStrategy,
    ImovelBuscaStrategy,
    ImovelBuscaTextoStrategy,
  ],
})
export class BuscasModule {}
