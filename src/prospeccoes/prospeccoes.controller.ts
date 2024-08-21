import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ProspeccoesService } from './prospeccoes.service';
import { CreateProspeccaoDto } from './dto/create-prospeccao.dto';
import { UpdateProspeccaoDto } from './dto/update-prospeccao.dto';
import {
  Order,
  OrderByFields,
  PaginationQueryDto,
} from 'src/common/dtos/pagination.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';

@ApiTags('prospecções')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prospeccoes')
export class ProspeccoesController {
  constructor(private readonly prospeccoesService: ProspeccoesService) {}

  @Post('criar-imovel')
  create(
    @UsuarioAtual() usuario: Usuario,
    @Body() createProspeccaoDto: CreateProspeccaoDto,
  ) {
    return this.prospeccoesService.create(usuario.id, createProspeccaoDto);
  }

  @Get('buscar-prospeccoes')
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

  @Get('buscar-vistoria/:id')
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

  @Delete('excluir-vistoria/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.prospeccoesService.remove(+id);
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma error: https://www.prisma.io/docs/orm/reference/error-reference
        throw new NotFoundException(`Registro não encontrado: ${id} ${error}`);
      }
      throw error;
    }
  }
}
