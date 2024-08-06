import { Controller, Get, Param } from '@nestjs/common';
import { GeosampaService } from './geosampa.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GeosampaCollectionDto } from './dto/geosampa-collection.dto';
import { GeosampaFeatureDto } from './dto/geosampa-feature.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@ApiTags('integracoes')
@Controller('geosampa')
export class IntegracoesController {
  constructor(private readonly geosampaService: GeosampaService) {}

  @ApiOperation({
    summary:
      'Busca um determinado lote. Id do lote com 11 dígitos (ex: 05507200564).',
  })
  @ApiResponse({ type: GeosampaFeatureDto })
  @Get('lote/:id')
  @IsPublic()
  findOneLote(@Param('id') id: string): Promise<GeosampaFeatureDto> {
    return this.geosampaService.findOneLote(id);
  }

  @ApiOperation({
    summary:
      'Busca todos os lotes em uma quadra. Id da quadra com 6 dígitos (ex:055072).',
  })
  @ApiResponse({ type: GeosampaCollectionDto })
  @Get('lotes-na-quadra/:id')
  @IsPublic()
  findAllLotesInQuadra(
    @Param('id') id: string,
  ): Promise<GeosampaCollectionDto> {
    return this.geosampaService.findAllLotesInQuadra(id);
  }

  @ApiOperation({
    summary:
      'Busca todas as quadras de um setor. Id do setor com 3 dígitos (ex: 055).',
  })
  @ApiResponse({ type: GeosampaCollectionDto })
  @Get('quadras-no-setor/:id')
  @IsPublic()
  findAllQuadrasInSetor(
    @Param('id') id: string,
  ): Promise<GeosampaCollectionDto> {
    return this.geosampaService.findAllQuadrasInSetor(id);
  }
}
