import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVistoriaDto } from 'src/vistorias/dto/create-vistoria.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalvaguardaService } from 'src/salvaguarda/salvaguarda.service';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { Vistoria } from '@prisma/client';

@Injectable()
export class VistoriasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly salvaguardaService: SalvaguardaService,
  ) {}

  async create(
    createVistoriaDto: CreateVistoriaDto,
    files: Array<Express.Multer.File>,
    usuarioId: string,
  ) {
    const uploadPromises = files.map((file) => {
      return this.salvaguardaService.uploadFile(file, usuarioId);
    });

    try {
      const fileUrls = await Promise.all(uploadPromises);

      const combinedAssets = files.map((file, index) => ({
        nomeArquivo: file.originalname,
        tipo: file.mimetype,
        url: fileUrls[index],
        usuarioId,
      }));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { files: _filesFromDto, ...createVistoriaNoFiles } =
        createVistoriaDto;

      const createdVistoria = await this.prisma.vistoria.create({
        data: {
          ...createVistoriaNoFiles,
          qtdePavimentos: +createVistoriaDto.qtdePavimentos,
          unifamiliar: createVistoriaDto.unifamiliar === false,
          multifamiliar: createVistoriaDto.multifamiliar === false,
          servico: createVistoriaDto.servico === false,
          usoEsquadriaBoaCondicao:
            createVistoriaDto.usoEsquadriaBoaCondicao === false,
          industria: createVistoriaDto.industria === false,
          usoPodaVegetacao: createVistoriaDto.usoPodaVegetacao === false,
          usoFachadaBoaCondicao:
            createVistoriaDto.usoFachadaBoaCondicao === false,
          comercio: createVistoriaDto.comercio === false,
          indiceOcupacaoConstatado: +createVistoriaDto.indiceOcupacaoConstatado,
          areaCoberturaTotalConstatada:
            +createVistoriaDto.areaCoberturaTotalConstatada,
          areaConstruidaTotalConstatada:
            +createVistoriaDto.areaConstruidaTotalConstatada,
          areaLoteTotalConstatada: +createVistoriaDto.areaLoteTotalConstatada,
          areaConstruidaNaoComputavel:
            +createVistoriaDto.areaConstruidaNaoComputavel,
          dataVistoria: createVistoriaDto.dataVistoria
            ? new Date(createVistoriaDto.dataVistoria)
            : null,

          usuarioId,
          ...(files.length > 0 && {
            VistoriaAsset: { create: combinedAssets },
          }),
        },
      });

      return await this.prisma.vistoria.findUnique({
        where: { id: createdVistoria.id },
        include: { VistoriaAsset: true },
      });
    } catch (error) {
      console.error('Error during file upload or Vistoria creation:', error);
      throw new Error(
        'Failed to upload files or create Vistoria. Please try again.',
      );
    }
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Vistoria[]> {
    const {
      limit = 10,
      offset = 0,
      order = 'asc',
      orderBy = 'atualizadoEm',
    } = paginationQuery;

    const orderByFields = orderBy ? { [orderBy]: order } : undefined;

    const where: any = { deletado: false };
    return this.prisma.vistoria.findMany({
      where,
      take: +limit,
      skip: +offset,
      orderBy: orderByFields,
      include: { VistoriaAsset: true },
    });
  }

  async findOne(id: number): Promise<Vistoria | null> {
    return this.prisma.vistoria.findUnique({
      where: {
        id: id,
      },
      include: { VistoriaAsset: true },
    });
  }

  async update(
    id: number,
    updateVistoriaDto: CreateVistoriaDto,
    files: Array<Express.Multer.File>,
    usuarioId: string,
  ) {
    const uploadPromises = files.map((file) => {
      return this.salvaguardaService.uploadFile(file, usuarioId);
    });

    try {
      const fileUrls = await Promise.all(uploadPromises);

      const combinedAssets = files.map((file, index) => ({
        nomeArquivo: file.originalname,
        tipo: file.mimetype,
        url: fileUrls[index],
        usuarioId,
      }));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { files: _filesFromDto, ...updateVistoriaNoFiles } =
        updateVistoriaDto;

      const updatedVistoria = await this.prisma.vistoria.update({
        where: { id },
        data: {
          ...updateVistoriaNoFiles,
          qtdePavimentos: +updateVistoriaNoFiles.qtdePavimentos,
          unifamiliar: updateVistoriaDto.unifamiliar === false,
          multifamiliar: updateVistoriaDto.multifamiliar === false,
          servico: updateVistoriaDto.servico === false,
          usoEsquadriaBoaCondicao:
            updateVistoriaDto.usoEsquadriaBoaCondicao === false,
          industria: updateVistoriaDto.industria === false,
          usoPodaVegetacao: updateVistoriaDto.usoPodaVegetacao === false,
          usoFachadaBoaCondicao:
            updateVistoriaDto.usoFachadaBoaCondicao === false,
          comercio: updateVistoriaDto.comercio === false,
          indiceOcupacaoConstatado: +updateVistoriaDto.indiceOcupacaoConstatado,
          areaCoberturaTotalConstatada:
            +updateVistoriaDto.areaCoberturaTotalConstatada,
          areaConstruidaTotalConstatada:
            +updateVistoriaDto.areaConstruidaTotalConstatada,
          areaLoteTotalConstatada: +updateVistoriaDto.areaLoteTotalConstatada,
          areaConstruidaNaoComputavel:
            +updateVistoriaDto.areaConstruidaNaoComputavel,
          dataVistoria: updateVistoriaDto.dataVistoria
            ? new Date(updateVistoriaDto.dataVistoria)
            : null,

          usuarioId,
          ...(files.length > 0 && {
            VistoriaAsset: { create: combinedAssets },
          }),
        },
      });

      return await this.prisma.vistoria.findUnique({
        where: { id: updatedVistoria.id },
        include: { VistoriaAsset: true },
      });
    } catch (error) {
      console.error('Error during file upload or Vistoria update:', error);
      throw new Error(
        'Failed to upload files or update Vistoria. Please try again.',
      );
    }
  }

  async removeVistoria(id: number): Promise<{ id: number; data: any }> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const vistoria = await prisma.vistoria.findUnique({
          where: { id },
          include: { VistoriaAsset: true },
        });

        if (!vistoria) {
          throw new NotFoundException(`Vistoria with ID ${id} not found`);
        }

        const deletedVistoria = await prisma.vistoria.delete({
          where: { id },
        });

        return {
          vistoria,
          deletedVistoria,
        };
      });

      const { vistoria } = result;

      for (const asset of vistoria.VistoriaAsset) {
        try {
          const fileName = this.extractFileNameFromUrl(asset.url);

          await this.salvaguardaService.deleteFile(fileName);
        } catch (error) {
          console.error(`Error deleting file ${asset.url} from Minio:`, error);
        }
      }

      return {
        id: result.deletedVistoria.id,
        data: result.deletedVistoria,
      };
    } catch (error) {
      console.error('Error deleting Vistoria and its assets:', error);
      throw error;
    }
  }

  async removeAsset(assetId: number): Promise<void> {
    try {
      const asset = await this.prisma.asset.findUnique({
        where: { id: assetId },
        select: { url: true, nomeArquivo: true, vistoriaId: true },
      });

      if (!asset) {
        throw new Error('Asset not found');
      }

      const fileName = this.extractFileNameFromUrl(asset.url);

      await this.prisma.asset.delete({
        where: { id: assetId },
      });

      await this.salvaguardaService.deleteFile(fileName);

      console.log(
        `Asset with ID ${assetId} and file ${fileName} deleted successfully.`,
      );
    } catch (error) {
      console.error('Error during asset deletion:', error);
      throw new Error('Failed to delete asset or file. Please try again.');
    }
  }

  async removeAssets(vistoriaId: number): Promise<void> {
    try {
      const assets = await this.prisma.asset.findMany({
        where: { vistoriaId: +vistoriaId },
        select: { url: true, nomeArquivo: true },
      });

      await this.prisma.asset.deleteMany({
        where: { vistoriaId: +vistoriaId },
      });

      const deletePromises = assets.map((asset) => {
        const fileName = this.extractFileNameFromUrl(asset.url);
        return this.salvaguardaService.deleteFile(fileName);
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error during asset deletion:', error);
      throw new Error('Failed to delete assets or files. Please try again.');
    }
  }

  private extractFileNameFromUrl(url: string): string {
    return url.split('/').pop();
  }
}
