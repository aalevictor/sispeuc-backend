import { Controller, Get, Param } from '@nestjs/common';
import { IntegracoesGeosampaService } from './integracoes-geosampa.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@ApiTags('integracoes')
@Controller('integracoes')
export class IntegracoesGeosampaController {
  constructor(
    private readonly integracoesGeosampaService: IntegracoesGeosampaService,
  ) {}

  @ApiOperation({
    summary: 'Busca um registro Setor/Quadra/Lote no formato: 027.026.0019-0',
  })
  @Get(':id')
  @IsPublic()
  findOne(@Param('id') id: string) {
    return this.integracoesGeosampaService.findOne(id);
  }
}
