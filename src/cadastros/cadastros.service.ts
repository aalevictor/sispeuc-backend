import { Injectable } from '@nestjs/common';
import { CreateCadastroDto } from './dto/create-cadastro.dto';
import { UpdateCadastroDto } from './dto/update-cadastro.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CadastrosService {
  constructor(private prisma: PrismaService) {}

  async create({
    createCadastroDto,
  }: {
    createCadastroDto: CreateCadastroDto;
  }) {
    const { processo, imovel } = createCadastroDto;

    try {
      const createdProcesso = await this.prisma.processo.create({
        data: {
          ...processo,
          ProcessoImovel: {
            create: Array.isArray(imovel) ? imovel : [imovel], // Handle multiple Imovel entries
          },
        },
        include: {
          ProcessoImovel: true, // Include related imovel in the response
        },
      });

      return createdProcesso;
    } catch (error) {
      // Log and handle errors
      console.error('Error creating processo:', error);
      throw new Error('Failed to create processo');
    }
  }

  // async create({
  //   createCadastroDto,
  // }: {
  //   createCadastroDto: CreateCadastroDto;
  // }) {
  //   const { processo, imovel } = createCadastroDto;

  //   try {
  //     const createdProcesso = await this.prisma.processo.create({
  //       data: {
  //         ...processo,
  //         ProcessoImovel: {
  //           create: {
  //             ...imovel,
  //           },
  //         },
  //       },
  //       include: {
  //         ProcessoImovel: true, // Include related imovel in the response if needed
  //       },
  //     });

  //     return createdProcesso;
  //   } catch (error) {
  //     // Log and handle errors
  //     console.error('Error creating processo:', error);
  //     throw new Error('Failed to create processo');
  //   }
  // }

  async findAll(paginationQuery: { limit: number; offset: number }) {
    // const { limit, offset } = paginationQuery;s

    return this.prisma.processo.findMany({
      where: { arquivado: false },
      include: {
        ProcessoImovel: true, // Assuming the relation is named `ProcessoImovel`
      },
    });
  }

  findOne(id: number) {
    return this.prisma.processo.findUnique({
      where: { id, arquivado: false },
      include: {
        ProcessoImovel: true, // Assuming the relation is named `ProcessoImovel`
      },
    });
  }

  update(id: number, updateCadastroDto: UpdateCadastroDto) {
    return this.prisma.processo.update({
      where: { id },
      data: updateCadastroDto,
    });
  }

  remove(id: number) {
    return this.prisma.processo.delete({ where: { id } });
  }

  softDeleted() {
    return this.prisma.processo.findMany({ where: { arquivado: true } });
  }
}
