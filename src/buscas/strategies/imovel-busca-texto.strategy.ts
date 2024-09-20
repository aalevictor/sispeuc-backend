import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImovelBuscaTextoStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    return await this.prisma.imovel.findMany({
      where: {
        deletado: false,

        sqlId: {
          search: query,
        },

        seiId: {
          search: query,
        },

        enderecoLogradouro: {
          search: query,
        },

        enderecoReferencia: {
          search: query,
        },

        registroNotasReferencia: {
          search: query,
        },
        usuarioId: {
          search: query,
        },
      },
    });
  }
}
