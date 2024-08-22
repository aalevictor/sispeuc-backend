import { Injectable } from '@nestjs/common';
import { CreateProspeccaoDto } from './dto/create-prospeccao.dto';
import { CreateManyProspeccaoDto } from './dto/createmany-prospeccao.dto';
import { UpdateProspeccaoDto } from './dto/update-prospeccao.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Imovel } from '@prisma/client';

@Injectable()
export class ProspeccoesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    usuarioId: string,
    createProspeccaoDto: CreateProspeccaoDto,
  ): Promise<Imovel> {
    return await this.prisma.imovel.create({
      data: {
        ...createProspeccaoDto,
        usuarioId,
      },
    });
  }

  // async createMany(
  //   usuarioId: string,
  //   createManyProspeccaoDto: CreateManyProspeccaoDto,
  // ): Promise<Imovel[] | any> {
  //   return await this.prisma.imovel.createMany({
  //     data: [
  //       {
  //         ...createManyProspeccaoDto.items,
  //         usuarioId,
  //       },
  //     ],
  //     skipDuplicates: false,
  //   });
  // }

  async createMany(
    usuarioId: string,
    createManyProspeccaoDto: CreateManyProspeccaoDto,
  ): Promise<any> {
    const { records } = createManyProspeccaoDto;

    const data = records.map((record) => ({
      ...record,
      usuarioId,
    }));

    return await this.prisma.imovel.createMany({
      data,
      skipDuplicates: false,
    });
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
    return this.prisma.imovel.update({
      where: { id },
      data: {
        ...updateProspeccaoDto,
        usuarioId,
      },
    });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.imovel.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
