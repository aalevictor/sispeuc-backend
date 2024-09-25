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
} from '@nestjs/common';
import { Vistoria2Service } from './vistoria2.service';
// import { CreateVistoria2Dto } from './dto/create-vistoria2.dto';
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

@ApiTags('vistorias2')
@Permissoes('ADM', 'SUP', 'DEV')
@ApiBearerAuth()
@Controller('vistoria2')
export class Vistoria2Controller {
  constructor(private readonly vistoria2Service: Vistoria2Service) {}

  @Post('criar-vistoria-com-anexo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', +process.env.MINIO_MAX_FILE_UPLOADS_PER_ENTITY),
  )
  @ApiBody({
    description: 'Create Vistoria with multiple Assets',
    type: CreateVistoriaDto,
  })
  @ApiResponse({ status: 201, description: 'Vistoria created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createVistoria(
    @UsuarioAtual() usuarioId: { id: string }, //Usar id par maior segurança
    @Body()
    createVistoriaDto: CreateVistoriaDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() response,
  ) {
    const result = await this.vistoria2Service.createWithAssets(
      createVistoriaDto,
      files,
      usuarioId.id,
    );

    return response.status(HttpStatus.CREATED).json(result);
  }

  @Delete('excluir-vistoria/:id')
  async removeVistoria(@Param('id') id: number) {
    return await this.vistoria2Service.removeVistoria(+id);
  }

  @Delete('excluir-anexo/:id')
  @ApiResponse({ status: 200, description: 'Asset deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Asset not found.' })
  @ApiResponse({ status: 500, description: 'Failed to delete asset or file.' })
  async removeAsset(@Param('id') id: number): Promise<void> {
    await this.vistoria2Service.removeAsset(+id);
  }

  @Delete('excluir-anexos/:vistoriaId')
  async removeAssets(@Param('vistoriaId') vistoriaId: number) {
    try {
      await this.vistoria2Service.removeAssets(+vistoriaId);
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
