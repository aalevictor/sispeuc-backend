import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditoriasService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const {
      limit = 10,
      offset = 0,
      order = 'asc',
      orderBy = 'criadoEm',
    } = paginationQuery;

    // OrderBy dinâmico
    const orderByFields = orderBy ? { [orderBy]: order } : undefined;

    return this.prisma.auditoria.findMany({
      take: +limit,
      skip: +offset,
      orderBy: orderByFields,
    });
  }

  findOne(id: number) {
    return this.prisma.auditoria.findUnique({
      where: { id },
    });
  }
}
