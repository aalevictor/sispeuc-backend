import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SalvaguardaService } from './salvaguarda.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { StorageObjectDto } from './dto/storage-object.dto';
import { StorageObjectsDto } from './dto/storage-objects.dto';

@ApiTags('salvaguarda')
@IsPublic()
@ApiConsumes('multipart/form-data')
@Controller()
export class SalvaguardaController {
  constructor(private readonly salvaguardaService: SalvaguardaService) {}

  @Post('enviar-arquivo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() storageObjectDto: StorageObjectDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    await this.salvaguardaService.createBucketIfNotExists();
    const fileName = await this.salvaguardaService.uploadFile(
      file,
      storageObjectDto.entityId,
    );
    return fileName;
  }

  @Post('enviar-arquivos')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Body() storageObjectsDto: StorageObjectsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<string[]> {
    await this.salvaguardaService.createBucketIfNotExists();

    const fileNames = await Promise.all(
      files.map((file) =>
        this.salvaguardaService.uploadFile(file, storageObjectsDto.entityId),
      ),
    );
    // console.log({ storageObjectsDto, fileNames });
    return fileNames;
  }

  @Get('obter-arquivo/:fileName')
  async getFiles(@Param('fileName') fileName: string) {
    const fileUrl = await this.salvaguardaService.getFileUrl(fileName);
    return fileUrl;
  }

  @Delete('excluir/:fileName')
  async deleteFile(@Param('fileName') fileName: string): Promise<void> {
    try {
      await this.salvaguardaService.deleteFile(fileName);
    } catch (error) {
      throw new HttpException(
        'File not found or could not be deleted',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
