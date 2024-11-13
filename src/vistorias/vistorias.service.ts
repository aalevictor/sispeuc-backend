import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVistoriaDto } from 'src/vistorias/dto/create-vistoria.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalvaguardaService } from 'src/salvaguarda/salvaguarda.service';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { Vistoria } from '@prisma/client';
import { VistoriaAssetDto, VistoriaResponseDto } from './dto/vistoria-response.dto';
import { AppService } from 'src/app.service';
import { contains, equals } from 'class-validator';
import { equal } from 'assert';

@Injectable()
export class VistoriasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly salvaguardaService: SalvaguardaService,
    private app: AppService
  ) {}

  async create(
    createVistoriaDto: CreateVistoriaDto,
    files: Array<Express.Multer.File>,
    usuarioId: string,
  ) {
    try {
      const { files: _filesFromDto, ...createVistoriaNoFiles } = createVistoriaDto;
      const createdVistoria: VistoriaResponseDto = await this.prisma.vistoria.create({
        data: {
          ...createVistoriaNoFiles,
          qtdePavimentos: +createVistoriaDto.qtdePavimentos,
          unifamiliar: this.toBoolean(createVistoriaDto.unifamiliar),
          multifamiliar: this.toBoolean(createVistoriaDto.multifamiliar),
          servico: this.toBoolean(createVistoriaDto.servico),
          usoEsquadriaBoaCondicao: this.toBoolean(
            createVistoriaDto.usoEsquadriaBoaCondicao,
          ),
          industria: this.toBoolean(createVistoriaDto.industria),
          usoPodaVegetacao: this.toBoolean(createVistoriaDto.usoPodaVegetacao),
          usoFachadaBoaCondicao: this.toBoolean(
            createVistoriaDto.usoFachadaBoaCondicao,
          ),
          comercio: this.toBoolean(createVistoriaDto.comercio),
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
          usuarioId
        },
        include: { VistoriaAsset: true }
      });
      if (createdVistoria && files && files.length > 0) 
        return await this.updateFileOnVistoria(createdVistoria, files);
      return createdVistoria;
    } catch (error) {
      throw new Error(
        'Failed to upload files or create Vistoria. Please try again.',
      );
    }
  }

  async findAll(
    pagina: number = 1,
    limite: number = 10,
    busca?: string,
    status?: boolean
  ) {
    [pagina, limite] = this.app.verificaPagina(pagina, limite);
    const searchParams = {
      ...(busca ?
        {
          OR: [
            { processoId: { contains: busca } },
          ]
        } :
        {}),
    };
    const total = await this.prisma.vistoria.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, users: [] };
    [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
    const subprefeituras = await this.prisma.vistoria.findMany({
      where: {
        ...searchParams,
        deletado: status
      },
      skip: (pagina - 1) * limite,
      take: limite
    });
    return {
      total: +total,
      pagina: +pagina,
      limite: +limite,
      data: subprefeituras
    };
  }

  async findOne(id: number): Promise<Vistoria | null> {
    return this.prisma.vistoria.findUnique({
      where: {
        id: id,
      },
      include: { 
        VistoriaAsset: { 
            orderBy: { nomeArquivo: 'asc' } 
        } 
      },
    });
  }

  async update(
    id: number,
    updateVistoriaDto: CreateVistoriaDto,
    files: Array<Express.Multer.File>,
    usuarioId: string,
  ) {
    try {
      const { files: _filesFromDto, ...updateVistoriaNoFiles } = updateVistoriaDto;
      const updatedVistoria: VistoriaResponseDto = await this.prisma.vistoria.update({
        where: { id },
        data: {
          ...updateVistoriaNoFiles,
          qtdePavimentos: +updateVistoriaNoFiles.qtdePavimentos,
          unifamiliar: this.toBoolean(updateVistoriaDto.unifamiliar),
          multifamiliar: this.toBoolean(updateVistoriaDto.multifamiliar),
          servico: this.toBoolean(updateVistoriaDto.servico),
          usoEsquadriaBoaCondicao: this.toBoolean(
            updateVistoriaDto.usoEsquadriaBoaCondicao,
          ),
          industria: this.toBoolean(updateVistoriaDto.industria),
          usoPodaVegetacao: this.toBoolean(updateVistoriaDto.usoPodaVegetacao),
          usoFachadaBoaCondicao: this.toBoolean(
            updateVistoriaDto.usoFachadaBoaCondicao,
          ),
          comercio: this.toBoolean(updateVistoriaDto.comercio),
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
          usuarioId
        },
        include: { VistoriaAsset: true }
      });
      if (updatedVistoria && files && files.length > 0) 
        return await this.updateFileOnVistoria(updatedVistoria, files);
      return updatedVistoria;
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

      // console.log(
      //   `Asset with ID ${assetId} and file ${fileName} deleted successfully.`,
      // );
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

  private toBoolean(value: string | boolean): boolean {
    if (typeof value === 'string') {
      return value === 'true';
    }
  }

  private async updateFileOnVistoria(
    vistoria: VistoriaResponseDto, 
    files: Array<Express.Multer.File>
  ): Promise<VistoriaResponseDto> {
    const usuarioId: string = vistoria.usuarioId;
    const uploads: Promise<VistoriaAssetDto>[] = files.map(async (file: Express.Multer.File) => {
      const fileUrl: string = await this.salvaguardaService
        .uploadFile(file, usuarioId)
      return {
        nomeArquivo: file.originalname,
        tipo: file.mimetype,
        url: fileUrl,
        usuarioId
      };
    });
    const combinedAssets: VistoriaAssetDto[] = await Promise.all(uploads);
    const updatedVistoriaAssets: VistoriaResponseDto = await this.prisma.vistoria.update({
      where: { id: vistoria.id },
      data: {
        ...(combinedAssets && combinedAssets.length > 0 && {
          VistoriaAsset: { create: combinedAssets },
        }),
      },
      include: { VistoriaAsset: true }
    });
    if (!updatedVistoriaAssets) 
      throw new Error('Erro ao subir arquivo e atualizar objeto de vistoria');
    return updatedVistoriaAssets;
  }
}
