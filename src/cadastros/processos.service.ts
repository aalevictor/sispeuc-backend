import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProcessoDto } from './dto/create-processo.dto';
import { Processo } from '@prisma/client';
import { UpdateProcessoDto } from './dto/update-processo.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppService } from 'src/app.service';

@Injectable()
export class ProcessosService {
  constructor(
    private prisma: PrismaService,
    private app: AppService
  ) { }

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

  async findAll(
    pagina: number = 1,
    limite: number = 10,
    busca?: string
  ) {
    [pagina, limite] = this.app.verificaPagina(pagina, limite);
    const searchParams = {
      ...(busca ?
        {
          OR: [
            { autuacaoSei: { contains: busca } },
            { ProcessoImovel: { some: { enderecoLogradouro: { contains: busca } } } }
          ]
        } :
        {}),
    };
    const total = await this.prisma.processo.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, users: [] };
    [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
    const subprefeituras = await this.prisma.processo.findMany({
      where: searchParams,
      skip: (pagina - 1) * limite,
      take: limite,
      include: {
        ProcessoImovel: true
      }
    });
    return {
      total: +total,
      pagina: +pagina,
      limite: +limite,
      data: subprefeituras
    };
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
