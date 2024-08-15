import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
//  UseInterceptors,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { AuditingInterceptor } from 'src/common/interceptors/auditing.interceptor';
// import { AuditTable } from 'src/common/decorators/audit-table.decorator';

@ApiTags('vistorias')
// @UseInterceptors(AuditingInterceptor)
// @AuditTable('vistorias')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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

  @Get('vistoria/buscar-tudo')
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

  @Delete('desativar-vistoria/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.vistoriasService.remove(+id);
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma error: https://www.prisma.io/docs/orm/reference/error-reference
        throw new NotFoundException(`Registro não encontrado: ${id} ${error}`);
      }
      throw error;
    }
  }
}
