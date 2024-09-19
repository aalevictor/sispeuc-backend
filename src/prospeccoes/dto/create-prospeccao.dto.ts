import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsDecimal, IsOptional } from 'class-validator';
import {
  EnderecoDistrito,
  EnderecoSubprefeitura,
  EnderecoSubprefeituraSigla,
  EnderecoMacroarea,
  EnderecoMacroAreaSigla,
  EnderecoZona,
  EnderecoZonaSigla,
} from '@prisma/client';

export class CreateProspeccaoDto {
  // @ApiProperty()
  // matriculaId: number;

  // @ApiProperty()
  // vistoriaId: number;

  @ApiProperty()
  seiId?: string;

  @ApiProperty()
  sqlId?: string;

  @ApiProperty()
  sqlSetor?: number;

  @ApiProperty()
  sqlQuadra?: number;

  @ApiProperty()
  sqlLote?: number;

  @ApiProperty()
  sqlDigito?: number;

  @ApiProperty()
  sqlPai: number;

  @ApiProperty()
  sqlFilho: number;

  @ApiProperty()
  registroNotasReferencia?: string;

  @ApiProperty()
  enderecoLogradouro?: string;

  @ApiProperty()
  enderecoNumero?: string;

  @ApiProperty()
  enderecoComplemento?: string;

  @ApiProperty()
  enderecoReferencia?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EnderecoDistrito)
  enderecoDistrito?: EnderecoDistrito = EnderecoDistrito.NC;

  @ApiProperty()
  enderecoCep?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EnderecoSubprefeitura)
  enderecoSubprefeitura?: EnderecoSubprefeitura = EnderecoSubprefeitura.NC;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EnderecoSubprefeituraSigla)
  enderecoSubprefeituraSigla?: EnderecoSubprefeituraSigla =
    EnderecoMacroAreaSigla.NC;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EnderecoMacroarea)
  enderecoMacroarea?: EnderecoMacroarea = EnderecoMacroarea.NC;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EnderecoMacroAreaSigla)
  enderecoMacroareaSigla?: EnderecoMacroAreaSigla = EnderecoMacroAreaSigla.NC;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EnderecoZona)
  enderecoZona?: EnderecoZona = EnderecoZona.NC;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EnderecoZonaSigla)
  enderecoZonaSigla?: EnderecoZonaSigla = EnderecoZonaSigla.NC;

  @ApiProperty()
  @IsDecimal()
  areaConstruidaTotalRegistrada?: number;

  @ApiProperty()
  @IsDecimal()
  areaLoteTotalRegistrada?: number;

  @ApiProperty()
  @IsDecimal()
  areaCoeficienteAproveitamento?: number;

  @ApiProperty()
  @IsDecimal()
  areaCoeficienteAproveitamentoMinimo?: number;

  // @ApiProperty({ default: null })
  // @IsOptional()
  // geoLatLong?: any | null;

  @ApiProperty()
  geoEpsg?: number;

  @ApiProperty()
  decretoNumero?: string;

  @ApiProperty()
  decretoTipo?: string;

  @ApiProperty()
  tombamentoCompresp?: string;

  @ApiProperty()
  tombamentoCondephat?: string;

  @ApiProperty()
  tombamentoIphan?: string;

  @ApiHideProperty()
  usuarioId: string;
}
