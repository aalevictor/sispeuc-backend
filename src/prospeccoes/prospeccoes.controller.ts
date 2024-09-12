import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ProspeccoesService } from './prospeccoes.service';
import { CreateProspeccaoDto } from './dto/create-prospeccao.dto';
import { CreateManyProspeccaoDto } from './dto/createmany-prospeccao.dto';
import { UpdateProspeccaoDto } from './dto/update-prospeccao.dto';
import {
  Order,
  OrderByFields,
  PaginationQueryDto,
} from 'src/common/dtos/pagination.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';

@ApiTags('prospecções')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@Controller('prospeccoes')
@UseInterceptors(AuditInterceptor)
export class ProspeccoesController {
  constructor(private readonly prospeccoesService: ProspeccoesService) {}

  @Post('criar-imovel')
  create(
    @UsuarioAtual() usuario: Usuario,
    @Body() createProspeccaoDto: CreateProspeccaoDto,
  ) {
    return this.prospeccoesService.create(usuario.id, createProspeccaoDto);
  }

  @Post('criar-imoveis')
  createMany(
    @UsuarioAtual() usuario: Usuario,
    @Body() createManyProspeccaoDto: CreateManyProspeccaoDto,
  ) {
    return this.prospeccoesService.createMany(
      usuario.id,
      createManyProspeccaoDto,
    );
  }

  @Get('buscar-imoveis')
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
    return this.prospeccoesService.findAll(paginationQuery);
  }

  @Get('buscar-imovel/:id')
  findOne(@Param('id') id: string) {
    return this.prospeccoesService.findOne(+id);
  }

  @Patch('atualizar-imovel/:id')
  update(
    @Param('id') id: string,
    @UsuarioAtual() usuario: Usuario,
    @Body() updateProspeccaoDto: UpdateProspeccaoDto,
  ) {
    return this.prospeccoesService.update(+id, usuario.id, updateProspeccaoDto);
  }

  @Delete('excluir-imovel/:id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.prospeccoesService.remove(+id);
      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Registro não encontrado: ${id} ${error}`);
      }
      throw error;
    }
  }

  @Get('quantificar-imoveis')
  async quantificarImoveis() {
    // Call the service method to get the counts
    return await this.prospeccoesService.countImoveis();
  }
}
