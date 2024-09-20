import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProcessoBuscaStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const queryInt = parseInt(query, 10);

    return this.prisma.processo.findMany({
      where: {
        OR: [
          {
            autuacaoSei: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            ...(!isNaN(queryInt) && { id: queryInt }),
          },
        ],
      },
    });
  }
}
