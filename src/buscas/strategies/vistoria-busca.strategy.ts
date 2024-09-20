import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VistoriaBuscaStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    return this.prisma.vistoria.findMany({
      where: {
        OR: [
          {
            processoId: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            imovelId: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
}
