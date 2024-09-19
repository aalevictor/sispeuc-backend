import { Module } from '@nestjs/common';
import { CadastrosService } from './cadastros.service';
import { CadastrosController } from './cadastros.controller';
import { ProcessosController } from './processos.controller';
import { ProcessosService } from './processos.service';

@Module({
  controllers: [CadastrosController, ProcessosController],
  providers: [CadastrosService, ProcessosService],
})
export class CadastrosModule {}
