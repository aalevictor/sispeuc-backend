import { Controller, Patch, Param, Query } from '@nestjs/common';
import { RelacionamentosService } from './relacionamentos.service';

import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('relacionamentos')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@Controller('relacionamentos')
export class RelacionamentosController {
  constructor(
    private readonly relacionamentosService: RelacionamentosService,
  ) {}

  @Patch('relacionar-processo-imovel/:idProcesso')
  @ApiOperation({ summary: 'Relacionar Imóvel(is) e Processo' })
  @ApiQuery({
    name: 'idImovel',
    type: Number,
    isArray: true,
    description: 'Imovel ID(s)',
  })
  updateImovelProcesso(
    @Query('idImovel') idImoveis: number | number[],
    @Param('idProcesso') idProcesso: string,
  ) {
    const normalizedIds = Array.isArray(idImoveis) ? idImoveis : [idImoveis];

    return this.relacionamentosService.updateImovelProcesso(
      normalizedIds.map(Number),
      +idProcesso,
    );
  }

  @Patch('relacionar-imovel-vistoria/:idImovel')
  @ApiOperation({ summary: 'Relacionar Vistoria(s) e Imóvel' })
  @ApiQuery({
    name: 'idVistoria',
    type: Number,
    isArray: true,
    description: 'Vistoria ID(s)',
  })
  updateVistoriaImovel(
    @Query('idVistoria') idVistorias: number | number[],
    @Param('idImovel') idImovel: string,
  ) {
    const normalizedIds = Array.isArray(idVistorias)
      ? idVistorias
      : [idVistorias];

    return this.relacionamentosService.updateVistoriaImovel(
      normalizedIds.map(Number),
      +idImovel,
    );
  }
}
