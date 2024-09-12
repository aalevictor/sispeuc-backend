import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditoriasService } from './auditorias.service';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Order, PaginationQueryDto } from 'src/common/dtos/pagination.dto';

export enum OrderByFields {
  criadoEm = 'criadoEm',
}

@ApiTags('auditorias')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@Controller('auditorias')
export class AuditoriasController {
  constructor(private readonly auditoriasService: AuditoriasService) {}

  @Get('buscar-alteracoes')
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: OrderByFields,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: Order,
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.auditoriasService.findAll(paginationQuery);
  }

  @Get('buscar-alteracao/:id')
  findOne(@Param('id') id: string) {
    return this.auditoriasService.findOne(+id);
  }
}
