import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImovelBuscaStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
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
            seiId: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
}
