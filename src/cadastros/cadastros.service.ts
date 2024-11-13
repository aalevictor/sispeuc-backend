import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCadastroDto } from './dto/create-cadastro.dto';
import { PaginationQueryDto } from './dto/pagination-cadastro.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CadastrosService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: string, createCadastroDto: CreateCadastroDto) {
    const { processo, imovel } = createCadastroDto;
    
    try {
      // Criar o registro do processo
      const createdProcesso = await this.prisma.processo.create({
        data: {
          ...processo,
          usuarioId,
          ProcessoImovel: {
            create: Array.isArray(imovel) ? imovel : [imovel],
          },
        },
        include: {
          ProcessoImovel: true,
        },
      });

      const updatedProcesso = await this.prisma.processo.findUnique({
        where: { id: createdProcesso.id },
        include: { ProcessoImovel: true },
      });
      return createdProcesso;
    } catch (error) {
      
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const targetField = error.meta?.target ?? 'unknown field';
        throw new ConflictException(
          `Unique constraint failed on the field: ${targetField}`,
        );
      }
      throw error;
    }
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const {
      limit = 10,
      offset = 0,
      order = 'asc',
      orderBy = 'atualizadoEm',
      autuacaoSei,
      processoId,
    } = paginationQuery;

    // OrderBy dinâmico
    const orderByFields = orderBy ? { [orderBy]: order } : undefined;

    // Filtro where dinâmico
    const where: any = { arquivado: false };

    if (autuacaoSei) {
      where.autuacaoSei = autuacaoSei;
    }

    if (processoId) {
      where.ProcessoImovel = { some: { processoId } };
    }

    return this.prisma.processo.findMany({
      where,
      take: +limit,
      skip: +offset,
      orderBy: orderByFields,
      include: {
        ProcessoImovel: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.processo.findUnique({
      where: { id, arquivado: false },
      include: {
        ProcessoImovel: true,
      },
    });
  }

  async remove(id: number): Promise<{ id: number; data: any }> {
    try {
      const deletedProcesso = await this.prisma.processo.delete({
        where: { id },
        include: {
          ProcessoImovel: true,
        },
      });

      return {
        id: deletedProcesso.id,
        data: deletedProcesso,
      };
    } catch (error) {
      console.error('Error deleting processo:', error);
      throw error;
    }
  }
}
