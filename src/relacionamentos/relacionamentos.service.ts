import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RelacionamentosService {
  constructor(private readonly prisma: PrismaService) {}

  async updateImovelProcesso(idImoveis: number[], idProcesso: number) {
    const updatePromises = idImoveis.map((idImovel) =>
      this.prisma.imovel.update({
        where: { id: idImovel },
        data: { imovelProcessoId: idProcesso },
      }),
    );

    const updatedImoveis = await Promise.all(updatePromises);
    return updatedImoveis;
  }

  async updateVistoriaImovel(idVistorias: number[], idImovel: number) {
    const updatePromises = idVistorias.map((idVistoria) =>
      this.prisma.vistoria.update({
        where: { id: idVistoria },
        data: { vistoriaImovelId: idImovel },
      }),
    );

    const updatedVistorias = await Promise.all(updatePromises);
    return updatedVistorias;
  }
}
