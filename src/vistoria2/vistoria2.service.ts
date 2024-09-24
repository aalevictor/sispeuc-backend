import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVistoria2Dto } from './dto/create-vistoria2.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalvaguardaService } from 'src/salvaguarda/salvaguarda.service';

@Injectable()
export class Vistoria2Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly salvaguardaService: SalvaguardaService,
  ) {}

  async createWithAssets(
    createVistoria2Dto: CreateVistoria2Dto,
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

      const createdVistoria = await this.prisma.vistoria.create({
        data: {
          ...createVistoria2Dto,
          qtdePavimentos: +createVistoria2Dto.qtdePavimentos,
          unifamiliar: createVistoria2Dto.unifamiliar === true,
          usuarioId,
          VistoriaAsset: {
            create: combinedAssets,
          },
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
