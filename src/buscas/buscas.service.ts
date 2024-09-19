import { Injectable } from '@nestjs/common';

import { VistoriaBuscaStrategy } from './strategies/vistoria-busca.strategy';
import { ImovelBuscaStrategy } from './strategies/imovel-busca.strategy';
import { ProcessoBuscaStrategy } from './strategies/processo-busca.strategy';

export interface BuscasStrategy {
  search(query: string | number): Promise<any>;
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
  ) {}

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
}
