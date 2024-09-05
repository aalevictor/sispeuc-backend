import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { VistoriasService } from './vistorias.service';
import { CreateVistoriaDto } from './dto/create-vistoria.dto';
import { UpdateVistoriaDto } from './dto/update-vistoria.dto';
import {
  Order,
  OrderByFields,
  PaginationQueryDto,
} from 'src/common/dtos/pagination.dto';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';

@ApiTags('vistorias')
// @UseInterceptors(AuditingInterceptor)
// @AuditTable('vistorias')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@UseInterceptors(AuditInterceptor)
@Controller('vistorias')
export class VistoriasController {
  constructor(private readonly vistoriasService: VistoriasService) {}

  @Post('criar-vistoria')
  create(
    @UsuarioAtual() usuario: Usuario,
    @Body() createVistoriaDto: CreateVistoriaDto,
  ) {
    return this.vistoriasService.create(usuario.id, createVistoriaDto);
  }

  @Get('buscar-vistorias')
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
    return this.vistoriasService.findAll(paginationQuery);
  }

  @Get('buscar-vistoria/:id')
  findOne(@Param('id') id: string) {
    return this.vistoriasService.findOne(+id);
  }

  @Patch('atualizar-vistoria/:id')
  update(
    @Param('id') id: string,
    @UsuarioAtual() usuario: Usuario,
    @Body() updateVistoriaDto: UpdateVistoriaDto,
  ) {
    return this.vistoriasService.update(+id, usuario.id, updateVistoriaDto);
  }

  @Delete('excluir-vistoria/:id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.vistoriasService.remove(+id);
      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Registro não encontrado: ${id} ${error}`);
      }
      throw error;
    }
  }
}
