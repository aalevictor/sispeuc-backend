import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Res,
  HttpStatus,
  Delete,
  HttpException,
  Param,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { CreateVistoriaDto } from 'src/vistorias/dto/create-vistoria.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { VistoriasService } from './vistorias.service';

@ApiTags('vistorias')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@Controller('vistorias')
export class VistoriasController {
  constructor(private readonly vistoriasService: VistoriasService) {}

  @Post('criar-vistoria')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files'), // definir no .env número máximo de files por requisição --> +process.env.MINIO_MAX_FILE_UPLOADS_PER_ENTITY
  )
  @ApiBody({
    description: 'Create Vistoria with multiple Assets',
    type: CreateVistoriaDto,
  })
  @ApiResponse({ status: 201, description: 'Vistoria created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createVistoria(
    @UsuarioAtual() usuarioId: { id: string }, //Usar id para maior segurança
    @Body()
    createVistoriaDto: CreateVistoriaDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() response,
  ) {
    const result = await this.vistoriasService.create(
      createVistoriaDto,
      files,
      usuarioId.id,
    );
    return response.status(HttpStatus.CREATED).json(result);
  }

  @Get('buscar-vistorias')
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.vistoriasService.findAll(paginationQuery);
  }
  @Get('buscar-vistoria/:id')
  findOne(@Param('id') id: string) {
    return this.vistoriasService.findOne(+id);
  }

  @Patch('atualizar-vistoria/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files'), // +process.env.MINIO_MAX_FILE_UPLOADS_PER_ENTITY
  )
  @ApiBody({
    description: 'Update Vistoria with multiple Assets',
    type: CreateVistoriaDto,
  })
  @ApiResponse({ status: 200, description: 'Vistoria updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateVistoria(
    @Param('id') id: number,
    @UsuarioAtual() usuarioId: { id: string },
    @Body() updateVistoriaDto: CreateVistoriaDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() response,
  ) {
    const result = await this.vistoriasService.update(
      +id,
      updateVistoriaDto,
      files,
      usuarioId.id,
    );

    return response.status(HttpStatus.OK).json(result);
  }

  @Delete('excluir-vistoria/:id')
  async removeVistoria(@Param('id') id: number) {
    return await this.vistoriasService.removeVistoria(+id);
  }

  @Delete('excluir-anexo/:id')
  @ApiResponse({ status: 200, description: 'Asset deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Asset not found.' })
  @ApiResponse({ status: 500, description: 'Failed to delete asset or file.' })
  async removeAsset(@Param('id') id: number): Promise<void> {
    return await this.vistoriasService.removeAsset(+id);
  }

  @Delete('excluir-anexos/:vistoriaId')
  async removeAssets(@Param('vistoriaId') vistoriaId: number) {
    try {
      await this.vistoriasService.removeAssets(+vistoriaId);
      return {
        message: `Assets and files for Vistoria ID ${vistoriaId} deleted successfully.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to delete assets or files. Please try again.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
