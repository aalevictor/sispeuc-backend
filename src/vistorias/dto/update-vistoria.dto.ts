import { PartialType } from '@nestjs/swagger';
import { CreateVistoriaDto } from './create-vistoria.dto';

export class UpdateVistoriaDto extends PartialType(CreateVistoriaDto) {}
