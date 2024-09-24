import { Module } from '@nestjs/common';
import { Vistoria2Service } from './vistoria2.service';
import { Vistoria2Controller } from './vistoria2.controller';
import { SalvaguardaService } from 'src/salvaguarda/salvaguarda.service';

@Module({
  controllers: [Vistoria2Controller],
  providers: [Vistoria2Service, SalvaguardaService],
})
export class Vistoria2Module {}
