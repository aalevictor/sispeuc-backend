import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { TipoTipologia, TipoUso, TipoVistoria } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDecimal, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";

export class VistoriaResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  @IsOptional()
  @IsString()
  processoId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  imovelId?: string;

  @ApiProperty({
    enum: TipoVistoria,
    enumName: 'TipoVistoria',
    required: false,
  })
  @IsOptional()
  @IsEnum(TipoVistoria)
  tipoVistoria?: TipoVistoria = TipoVistoria.presencial;

  @ApiProperty({
    enum: TipoTipologia,
    enumName: 'TipoTipologia',
    required: false,
  })
  @IsOptional()
  @IsEnum(TipoTipologia)
  tipoTipologia?: TipoTipologia = TipoTipologia.naoEdificado;

  @ApiProperty({
    enum: TipoUso,
    enumName: 'TipoUso',
    required: false,
  })
  @IsOptional()
  @IsEnum(TipoUso)
  tipoUso?: TipoUso = TipoUso.residencial;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  qtdePavimentos?: number;

  @ApiProperty()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  unifamiliar?: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  multifamiliar?: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  comercio?: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  servico?: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  industria?: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  usoFachadaBoaCondicao?: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  usoEsquadriaBoaCondicao?: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  usoPodaVegetacao?: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsOptional()
  @IsDecimal()
  areaConstruidaTotalConstatada?: number;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsOptional()
  @IsDecimal()
  areaLoteTotalConstatada?: number;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsOptional()
  @IsDecimal()
  indiceOcupacaoConstatado?: number;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsOptional()
  @IsDecimal()
  areaCoberturaTotalConstatada?: number;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsOptional()
  @IsDecimal()
  areaConstruidaNaoComputavel?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  dataVistoria?: Date;

  @ApiProperty()
  @IsString()
  usuarioId: string;

  @ApiProperty()
  @IsDate()
  criadoEm: Date;

  @ApiProperty()
  @IsDate()
  atualizadoEm: Date;

  @ApiProperty()
  @IsBoolean()
  deletado: boolean;

  @ApiHideProperty()
  @IsOptional()
  vistoriaImovelId?: number;

  @ApiProperty()
  VistoriaAsset: Array<VistoriaAsset>;
}

export class VistoriaAsset {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nomeArquivo: string;
  @ApiProperty()
  tipo: string;
  @ApiProperty()
  url: string;
  @ApiProperty()
  criadoEm: Date;
  @ApiProperty()
  usuarioId: string;
  @ApiProperty()
  vistoriaId: number;
}
