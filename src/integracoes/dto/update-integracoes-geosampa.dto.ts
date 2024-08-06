import { PartialType } from '@nestjs/swagger';
import { CreateIntegracoesGeosampaDto } from './create-integracoes-geosampa.dto';

export class UpdateIntegracoesGeosampaDto extends PartialType(
  CreateIntegracoesGeosampaDto,
) {}
