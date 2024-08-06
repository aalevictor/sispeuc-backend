import { Injectable } from '@nestjs/common';
import { CreateCadastroDto } from './dto/create-cadastro.dto';
import { UpdateCadastroDto } from './dto/update-cadastro.dto';
import { PaginationQueryDto } from './dto/pagination-cadastro.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CadastrosService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: string, createCadastroDto: CreateCadastroDto) {
    const { processo, imovel } = createCadastroDto;

    try {
      const createdProcesso = await this.prisma.processo.create({
        data: {
          ...processo,
          usuarioId,
          ProcessoImovel: {
            create: Array.isArray(imovel) ? imovel : [imovel], // Criar múltiplas entradas
          },
        },
        include: {
          ProcessoImovel: true, // Incluir imóveis relacionados na resposta
        },
      });

      const plainProcesso = JSON.parse(JSON.stringify(processo));
      const plainImovel = JSON.parse(JSON.stringify(imovel));
      await this.prisma.auditoria.create({
        data: {
          nomeTabela: 'Processo',
          registroId: createdProcesso.id,
          usuarioId: usuarioId,
          alteracaoTipo: 'CREATE',
          alteracao: {
            processo: plainProcesso,
            imovel: plainImovel,
          },
        },
      });

      return createdProcesso;
    } catch (error) {
      console.error('Error creating processo:', error);
      throw new Error('Failed to create processo');
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

  async update(
    id: number,
    updateCadastroDto: UpdateCadastroDto,
    usuarioId: string,
  ) {
    const { processo, imovel } = updateCadastroDto;

    try {
      const updatedProcesso = await this.prisma.processo.update({
        where: { id },
        data: {
          ...processo,
          ProcessoImovel: {
            deleteMany: { processoId: id }, // Remove existing imovel entries related to the processo
            create: imovel.map((imovelEntry) => ({
              ...imovelEntry,
              processoId: id, // Ensure the relationship is maintained
            })),
          },
        },
        include: {
          ProcessoImovel: true,
        },
      });

      const plainProcesso = JSON.parse(JSON.stringify(processo));
      const plainImovel = JSON.parse(JSON.stringify(imovel));
      await this.prisma.auditoria.create({
        data: {
          nomeTabela: 'Processo',
          registroId: updatedProcesso.id,
          usuarioId: usuarioId,
          alteracaoTipo: 'UPDATE',
          alteracao: {
            processo: plainProcesso,
            imovel: plainImovel,
          },
        },
      });

      return updatedProcesso;
    } catch (error) {
      console.error('Error updating processo:', error);
      throw new Error('Failed to update processo');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.processo.delete({
        where: { id },
      });
    } catch (error) {
      // Rethrow error for handling in the controller
      throw error;
    }
  }

  // softDeleted() {
  //   return this.prisma.processo.findMany({ where: { arquivado: true } });
  // }
}
