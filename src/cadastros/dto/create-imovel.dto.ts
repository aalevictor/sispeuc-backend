import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsDecimal, IsOptional } from 'class-validator';

export class CreateImovelDto {
  // @ApiProperty()
  // matriculaId: number;

  // @ApiProperty()
  // vistoriaId: number;

  // @ApiProperty()
  // processoId: number;

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

  @ApiProperty({ enum: $Enums.EnderecoDistrito, default: null })
  @IsOptional()
  @IsEnum($Enums.EnderecoDistrito)
  enderecoDistrito?: $Enums.EnderecoDistrito;

  @ApiProperty()
  enderecoCep?: string;

  @ApiProperty({ enum: $Enums.EnderecoSubprefeitura, default: null })
  @IsOptional()
  @IsEnum($Enums.EnderecoSubprefeitura)
  enderecoSubprefeitura?: $Enums.EnderecoSubprefeitura;

  @ApiProperty({ enum: $Enums.EnderecoSubprefeituraSigla, default: null })
  @IsOptional()
  @IsEnum($Enums.EnderecoSubprefeituraSigla)
  enderecoSubprefeituraSigla?: $Enums.EnderecoSubprefeituraSigla;

  @ApiProperty({ enum: $Enums.EnderecoMacroarea, default: null })
  @IsOptional()
  @IsEnum($Enums.EnderecoMacroarea)
  enderecoMacroarea?: $Enums.EnderecoMacroarea;

  @ApiProperty({ enum: $Enums.EnderecoMacroAreaSigla, default: null })
  @IsOptional()
  @IsEnum($Enums.EnderecoMacroAreaSigla)
  enderecoMacroareaSigla?: $Enums.EnderecoMacroAreaSigla;

  @ApiProperty({ enum: $Enums.EnderecoZona, default: null })
  @IsOptional()
  @IsEnum($Enums.EnderecoZona)
  enderecoZona?: $Enums.EnderecoZona;

  @ApiProperty({ enum: $Enums.EnderecoZonaSigla, default: null })
  @IsOptional()
  @IsEnum($Enums.EnderecoZonaSigla)
  enderecoZonaSigla?: $Enums.EnderecoZonaSigla;

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

  usuarioId: string;

  constructor(partial: Partial<CreateImovelDto> = {}) {
    // this.matriculaId = partial.matriculaId ?? 0; // Default value or value from partial
    // this.vistoriaId = partial.vistoriaId ?? 0;
    // this.processoId = partial.processoId ?? 0;
    this.sqlSetor = partial.sqlSetor ?? null;
    this.sqlQuadra = partial.sqlQuadra ?? null;
    this.sqlLote = partial.sqlLote ?? null;
    this.sqlDigito = partial.sqlDigito ?? null;
    this.sqlPai = partial.sqlPai ?? 0;
    this.sqlFilho = partial.sqlFilho ?? 0;
    this.registroNotasReferencia = partial.registroNotasReferencia ?? null;
    this.enderecoLogradouro = partial.enderecoLogradouro ?? null;
    this.enderecoNumero = partial.enderecoNumero ?? null;
    this.enderecoComplemento = partial.enderecoComplemento ?? null;
    this.enderecoReferencia = partial.enderecoReferencia ?? null;
    this.enderecoDistrito = partial.enderecoDistrito ?? null;
    this.enderecoCep = partial.enderecoCep ?? null;
    this.enderecoSubprefeitura = partial.enderecoSubprefeitura ?? null;
    this.enderecoSubprefeituraSigla =
      partial.enderecoSubprefeituraSigla ?? null;
    this.enderecoMacroarea = partial.enderecoMacroarea ?? null;
    this.enderecoMacroareaSigla = partial.enderecoMacroareaSigla ?? null;
    this.enderecoZona = partial.enderecoZona ?? null;
    this.enderecoZonaSigla = partial.enderecoZonaSigla ?? null;
    this.areaConstruidaTotalRegistrada =
      partial.areaConstruidaTotalRegistrada ?? 0;
    this.areaLoteTotalRegistrada = partial.areaLoteTotalRegistrada ?? 0;
    this.areaCoeficienteAproveitamento =
      partial.areaCoeficienteAproveitamento ?? 0;
    this.areaCoeficienteAproveitamentoMinimo =
      partial.areaCoeficienteAproveitamentoMinimo ?? 0;
    this.geoEpsg = partial.geoEpsg ?? 4326; // Default value example
    this.decretoNumero = partial.decretoNumero ?? null;
    this.decretoTipo = partial.decretoTipo ?? null;
    this.tombamentoCompresp = partial.tombamentoCompresp ?? null;
    this.tombamentoCondephat = partial.tombamentoCondephat ?? null;
    this.tombamentoIphan = partial.tombamentoIphan ?? null;
  }
}
