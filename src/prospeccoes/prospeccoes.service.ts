import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProspeccaoDto } from './dto/create-prospeccao.dto';
import { CreateManyProspeccaoDto } from './dto/createmany-prospeccao.dto';
import { UpdateProspeccaoDto } from './dto/update-prospeccao.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Imovel } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProspeccoesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    usuarioId: string,
    createProspeccaoDto: CreateProspeccaoDto,
  ): Promise<Imovel> {
    try {
      return await this.prisma.imovel.create({
        data: {
          ...createProspeccaoDto,
          usuarioId,
        },
      });
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

  async createMany(
    usuarioId: string,
    createManyProspeccaoDto: CreateManyProspeccaoDto,
  ): Promise<any> {
    const { records } = createManyProspeccaoDto;

    const data = records.map((record) => ({
      ...record,
      usuarioId,
    }));

    try {
      return await this.prisma.imovel.createMany({
        data,
        skipDuplicates: false,
      });
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

  async findAll(paginationQuery: PaginationQueryDto): Promise<Imovel[]> {
    const {
      limit = 10,
      offset = 0,
      order = 'asc',
      orderBy = 'atualizadoEm',
    } = paginationQuery;

    const orderByFields = orderBy ? { [orderBy]: order } : undefined;

    const where: any = { deletado: false };
    return this.prisma.imovel.findMany({
      where,
      take: +limit,
      skip: +offset,
      orderBy: orderByFields,
    });
  }

  async findOne(id: number): Promise<Imovel | null> {
    return this.prisma.imovel.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    usuarioId: string,
    updateProspeccaoDto: UpdateProspeccaoDto,
  ): Promise<Imovel> {
    try {
      return this.prisma.imovel.update({
        where: { id },
        data: {
          ...updateProspeccaoDto,
          usuarioId,
        },
      });
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

  async remove(id: number): Promise<{ id: number; data: any }> {
    try {
      const deletedImovel = await this.prisma.imovel.delete({
        where: { id },
      });

      return {
        id: deletedImovel.id,
        data: deletedImovel,
      };
    } catch (error) {
      console.error('Error deleting processo:', error);
      throw error;
    }
  }

  async countImoveis() {
    // Contar todos os registros de Imóvel
    const total = await this.prisma.imovel.count();

    // Contar Imóveis 'Em prospecção' (onde sqlId é nulo)
    const emProspeccao = await this.prisma.imovel.count({
      where: {
        sqlId: {
          equals: null,
        },
      },
    });

    // Contar Imóveis 'Em preenchimento' (onde sqlId não é nulo e seiId é nulo)
    const emPreenchimento = await this.prisma.imovel.count({
      where: {
        sqlId: {
          not: null,
        },
        seiId: {
          equals: null,
        },
      },
    });

    // Contar Imóveis 'Candidato a vistoria' (onde sqlId e seiId não são nulos e mais de 80% dos campos estão preenchidos)
    const imoveis = await this.prisma.imovel.findMany({
      where: {
        sqlId: {
          not: null,
        },
        seiId: {
          not: null,
        },
      },
    });

    const candidatoVistoriaCount = imoveis.filter((imovel) => {
      return this.porcentagemCamposPreenchidos(imovel) > 80;
    }).length;

    // Retornar as contagens conforme especificado
    return {
      Total: total,
      'Em prospecção': emProspeccao,
      'Em preenchimento': emPreenchimento,
      'Candidato a vistoria': candidatoVistoriaCount,
    };
  }

  // Função auxiliar para calcular a porcentagem de campos preenchidos em um registro de Imóvel
  private porcentagemCamposPreenchidos(imovel: Imovel): number {
    const camposTotal = Object.keys(imovel).length;
    const camposPreenchidos = Object.values(imovel).filter(
      (valor) => valor !== null && valor !== undefined,
    ).length;
    return (camposPreenchidos / camposTotal) * 100;
  }
}
