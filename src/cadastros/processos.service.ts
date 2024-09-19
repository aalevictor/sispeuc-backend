import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProcessoDto } from './dto/create-processo.dto';
import { Processo } from '@prisma/client';
import { UpdateProcessoDto } from './dto/update-processo.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProcessosService {
  constructor(private prisma: PrismaService) {}

  async create(
    usuarioId: string,
    createProcessoDto: CreateProcessoDto,
  ): Promise<Processo> {
    try {
      return await this.prisma.processo.create({
        data: {
          ...createProcessoDto,
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

  async findAll(paginationQuery: PaginationQueryDto): Promise<Processo[]> {
    const {
      limit = 10,
      offset = 0,
      order = 'asc',
      orderBy = 'atualizadoEm',
    } = paginationQuery;

    const orderByFields = orderBy ? { [orderBy]: order } : undefined;

    return this.prisma.processo.findMany({
      take: +limit,
      skip: +offset,
      orderBy: orderByFields,
    });
  }

  async findOne(id: number): Promise<Processo | null> {
    return this.prisma.processo.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    usuarioId: string,
    updateProcessoDto: UpdateProcessoDto,
  ): Promise<Processo> {
    try {
      return await this.prisma.processo.update({
        where: { id },
        data: {
          ...updateProcessoDto,
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
      const deletedProcesso = await this.prisma.processo.delete({
        where: { id },
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
