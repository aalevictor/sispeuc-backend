import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VistoriaBuscaTextoStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    return await this.prisma.vistoria.findMany({
      where: {
        deletado: false,
        processoId: {
          search: query,
        },
        imovelId: {
          search: query,
        },
        descricao: {
          search: query,
        },
        usuarioId: {
          search: query,
        },
      },
    });
  }
}
