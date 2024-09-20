import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImovelBuscaStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const queryInt = parseInt(query, 10);

    return this.prisma.imovel.findMany({
      where: {
        OR: [
          {
            sqlId: {
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
