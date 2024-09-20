import { Controller, Get, Query } from '@nestjs/common';
import { SearchQueryDto } from './dto/search-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { BuscasService } from './buscas.service';

@ApiTags('buscas')
// @UseInterceptors(AuditingInterceptor)
// @AuditTable('vistorias')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@Controller('buscas')
export class BuscasController {
  constructor(private readonly buscasService: BuscasService) {}

  @Get('buscar-por-id')
  async search(@Query() searchQueryDto: SearchQueryDto) {
    const { model, query } = searchQueryDto;
    const strategy = this.buscasService.getStrategy(model);
    return strategy.search(query);
  }

  @Get('buscar-por-texto')
  async fulltextsearch(@Query() searchQueryDto: SearchQueryDto) {
    const { model, query } = searchQueryDto;
    const strategy = this.buscasService.getFullTextSearchStrategy(model);
    return strategy.search(query);
  }
}
