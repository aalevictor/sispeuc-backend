import { Injectable } from '@nestjs/common';

import { VistoriaBuscaStrategy } from './strategies/vistoria-busca.strategy';
import { ImovelBuscaStrategy } from './strategies/imovel-busca.strategy';
import { ProcessoBuscaStrategy } from './strategies/processo-busca.strategy';
import { VistoriaBuscaTextoStrategy } from './strategies/vistoria-busca-texto.strategy';
import { ImovelBuscaTextoStrategy } from './strategies/imovel-busca-texto.strategy';
import { ProcessoBuscaTextoStrategy } from './strategies/processo-busca-texto.strategy';
import { ProspeccoesService } from 'src/prospeccoes/prospeccoes.service';
import { CadastrosService } from 'src/cadastros/cadastros.service';
import { VistoriasService } from 'src/vistorias/vistorias.service';

export interface BuscasStrategy {
  search(query: string): Promise<any>;
}

export interface FindOne {
  findOne(query: number): Promise<any>;
}

export enum SearchType {
  PROCESSO = 'processo',
  IMOVEL = 'imovel',
  VISTORIA = 'vistoria',
}

@Injectable()
export class BuscasService {
  constructor(
    private readonly vistoriaBuscaStrategy: VistoriaBuscaStrategy,
    private readonly imovelBuscaStrategy: ImovelBuscaStrategy,
    private readonly processoBuscaStrategy: ProcessoBuscaStrategy,
    private readonly vistoriaBuscaTextoStrategy: VistoriaBuscaTextoStrategy,
    private readonly imovelBuscaTextoStrategy: ImovelBuscaTextoStrategy,
    private readonly processoBuscaTextoStrategy: ProcessoBuscaTextoStrategy,
    private readonly prospeccoesService: ProspeccoesService,
    private readonly cadastrosService: CadastrosService,
    private readonly vistoriasService: VistoriasService,
  ) {}

  getStrategyOne(model: SearchType): FindOne {
    switch (model) {
      case SearchType.VISTORIA:
        return this.vistoriasService;
      case SearchType.IMOVEL:
        return this.prospeccoesService;
      case SearchType.PROCESSO:
        return this.cadastrosService;

      default:
        throw new Error('No matching strategy found');
    }
  }

  getStrategy(model: SearchType): BuscasStrategy {
    switch (model) {
      case SearchType.VISTORIA:
        return this.vistoriaBuscaStrategy;
      case SearchType.IMOVEL:
        return this.imovelBuscaStrategy;
      case SearchType.PROCESSO:
        return this.processoBuscaStrategy;
      default:
        throw new Error('No matching strategy found');
    }
  }

  getFullTextSearchStrategy(model: SearchType): BuscasStrategy {
    switch (model) {
      case SearchType.VISTORIA:
        return this.vistoriaBuscaTextoStrategy;
      case SearchType.IMOVEL:
        return this.imovelBuscaTextoStrategy;
      case SearchType.PROCESSO:
        return this.processoBuscaTextoStrategy;
      default:
        throw new Error('No matching strategy found');
    }
  }
}
