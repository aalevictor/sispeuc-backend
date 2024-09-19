import { Module } from '@nestjs/common';
import { BuscasService } from './buscas.service';
import { BuscasController } from './buscas.controller';
import { VistoriaBuscaStrategy } from './strategies/vistoria-busca.strategy';
import { ProcessoBuscaStrategy } from './strategies/processo-busca.strategy';
import { ImovelBuscaStrategy } from './strategies/imovel-busca.strategy';

@Module({
  imports: [],
  controllers: [BuscasController],
  providers: [
    BuscasService,
    VistoriaBuscaStrategy,
    ProcessoBuscaStrategy,
    ImovelBuscaStrategy,
  ],
})
export class BuscasModule {}
