import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { ProcessosService } from './processos.service';
import { CreateProcessoDto } from './dto/create-processo.dto';
import { UpdateProcessoDto } from './dto/update-processo.dto';

@ApiTags('cadastros')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@UseInterceptors(AuditInterceptor)
@Controller('processos')
export class ProcessosController {
  constructor(private readonly processosService: ProcessosService) {}

  @Post('criar-processo')
  create(
    @UsuarioAtual() usuario: Usuario,
    @Body() createProcessoDto: CreateProcessoDto,
  ) {
    return this.processosService.create(usuario.id, createProcessoDto);
  }

  @Get('buscar-processos')
  findAll(
    @Query('pagina') pagina: string = '1',
    @Query('limite') limite: string = '10',
    @Query('busca') busca?: string,
  ) {
    return this.processosService.findAll(+pagina, +limite, busca);
  }

  @Get('buscar-processo/:id')
  findOne(@Param('id') id: string) {
    return this.processosService.findOne(+id);
  }

  @Patch('atualizar-processo/:id')
  update(
    @Param('id') id: string,
    @UsuarioAtual() usuario: Usuario,
    @Body() updateProcessoDto: UpdateProcessoDto,
  ) {
    return this.processosService.update(+id, usuario.id, updateProcessoDto);
  }

  @Delete('excluir-processo/:id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.processosService.remove(+id);
      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Registro não encontrado: ${id} ${error}`);
      }
      throw error;
    }
  }
}
