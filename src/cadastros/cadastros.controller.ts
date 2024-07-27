import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CadastrosService } from './cadastros.service';
import { CreateCadastroDto } from './dto/create-cadastro.dto';
import { UpdateCadastroDto } from './dto/update-cadastro.dto';
import { PaginationQueryDto } from './dto/pagination-cadastro.dto';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('cadastros')
@Controller('cadastros')
export class CadastrosController {
  constructor(private readonly cadastrosService: CadastrosService) {}

  @Permissoes('ADM', 'SUP', 'DEV')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('criar-cadastro')
  create(@Body() createCadastroDto: CreateCadastroDto) {
    return this.cadastrosService.create({ createCadastroDto });
  }

  @Permissoes('ADM', 'SUP', 'DEV')
  @Get('buscar-tudo')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.cadastrosService.findAll({ limit, offset });
  }

  @Permissoes('ADM', 'SUP', 'DEV')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('buscar-cadastro/:id')
  findOne(@Param('id') id: string) {
    return this.cadastrosService.findOne(+id);
  }

  @Permissoes('ADM', 'SUP', 'DEV')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('atualizar-cadastro/:id')
  update(
    @Param('id') id: string,
    @Body() updateCadastroDto: UpdateCadastroDto,
  ) {
    return this.cadastrosService.update(+id, updateCadastroDto);
  }

  @Permissoes('ADM', 'SUP')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('desativar-cadastro/:id')
  remove(@Param('id') id: string) {
    return this.cadastrosService.remove(+id);
  }
}
