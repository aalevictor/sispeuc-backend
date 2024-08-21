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
import { CadastrosService } from './cadastros.service';
import { CreateCadastroDto } from './dto/create-cadastro.dto';
import { UpdateCadastroDto } from './dto/update-cadastro.dto';
import {
  Order,
  OrderByFields,
  PaginationQueryDto,
} from './dto/pagination-cadastro.dto';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';

@ApiTags('cadastros')
@Controller('cadastros')
export class CadastrosController {
  constructor(private readonly cadastrosService: CadastrosService) {}

  @Permissoes('ADM', 'SUP', 'DEV')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('criar-cadastro')
  create(
    @UsuarioAtual() usuario: Usuario,
    @Body() createCadastroDto: CreateCadastroDto,
  ) {
    return this.cadastrosService.create(usuario.id, createCadastroDto);
  }

  @Permissoes('ADM', 'SUP', 'DEV')
  @Get('buscar-cadastros')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @ApiQuery({
    name: 'autuacaoSei',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'processoId',
    required: false,
    type: Number,
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.cadastrosService.findAll(paginationQuery);
  }

  @Permissoes('ADM', 'SUP', 'DEV')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('buscar-cadastro/:id')
  findOne(@Param('id') id: string) {
    return this.cadastrosService.findOne(+id);
  }

  @Permissoes('ADM', 'SUP', 'DEV')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('atualizar-cadastro/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCadastroDto: UpdateCadastroDto,
    @UsuarioAtual() usuario: Usuario,
  ) {
    return this.cadastrosService.update(+id, updateCadastroDto, usuario.id);
  }

  @Permissoes('ADM', 'SUP', 'DEV')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('excluir-cadastro/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.cadastrosService.remove(+id);
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma error: https://www.prisma.io/docs/orm/reference/error-reference
        throw new NotFoundException(`Registro não encontrado: ${id} ${error}`);
      }
      throw error;
    }
  }
}
