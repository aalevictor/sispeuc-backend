import { Injectable } from '@nestjs/common';
import { CreateVistoriaDto } from './dto/create-vistoria.dto';
import { UpdateVistoriaDto } from './dto/update-vistoria.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Vistoria } from '@prisma/client';

@Injectable()
export class VistoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    usuarioId: string,
    createVistoriaDto: CreateVistoriaDto,
  ): Promise<Vistoria> {
    return await this.prisma.vistoria.create({
      data: {
        ...createVistoriaDto,
        usuarioId,
      },
    });
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Vistoria[]> {
    const {
      limit = 10,
      offset = 0,
      order = 'asc',
      orderBy = 'atualizadoEm',
    } = paginationQuery;

    const orderByFields = orderBy ? { [orderBy]: order } : undefined;

    const where: any = { deletado: false };
    return this.prisma.vistoria.findMany({
      where,
      take: +limit,
      skip: +offset,
      orderBy: orderByFields,
    });
  }

  async findOne(id: number): Promise<Vistoria | null> {
    return this.prisma.vistoria.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    usuarioId: string,
    updateVistoriaDto: UpdateVistoriaDto,
  ): Promise<Vistoria> {
    const { vistoriaImovelId, ...dataWithoutImovelId } = updateVistoriaDto;

    const vistoriaExists = await this.prisma.vistoria.findUnique({
      where: { id },
    });
    if (!vistoriaExists) {
      throw new Error(`Vistoria with id ${id} does not exist`);
    }

    if (vistoriaImovelId) {
      const imovelExists = await this.prisma.imovel.findUnique({
        where: { id: vistoriaImovelId },
      });
      if (!imovelExists) {
        throw new Error(`Imovel with id ${vistoriaImovelId} does not exist`);
      }
    }

    return await this.prisma.vistoria.update({
      where: { id },
      data: {
        ...dataWithoutImovelId,
        usuarioId,
        vistoriaImovel: vistoriaImovelId
          ? { connect: { id: vistoriaImovelId } }
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.vistoria.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
