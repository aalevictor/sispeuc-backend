import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProcessoBuscaTextoStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    return await this.prisma.processo.findMany({
      where: {
        arquivado: false,
        autuacaoSei: {
          search: query,
        },
        estado: {
          search: query,
        },
        usuarioId: {
          search: query,
        },
      },
    });
  }
}
