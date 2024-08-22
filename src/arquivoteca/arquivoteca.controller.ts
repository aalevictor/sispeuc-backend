import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ArquivotecaService } from './arquivoteca.service';

import { StorageObjectDto } from './dto/storage-object.dto';
import { StorageObjectsDto } from './dto/storage-objects.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
// import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { multerConfig } from './multer.config';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('arquivoteca')
// @Permissoes('ADM', 'SUP', 'DEV')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@IsPublic()
@Controller('arquivoteca')
export class ArquivotecaController {
  constructor(private readonly arquivotecaService: ArquivotecaService) {}

  @Post('um')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(
    @Body() storageObjectDto: StorageObjectDto,
    @UploadedFile() file: Express.Multer.File,
  ): void {
    console.log({ storageObjectDto, file });
  }

  @Post('muitos')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', undefined, multerConfig))
  uploadMultipleFiles(
    @Body() storageObjectsDto: StorageObjectsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): void {
    console.log({ storageObjectsDto, files });
  }
}
