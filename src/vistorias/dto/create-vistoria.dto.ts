import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDecimal,
} from 'class-validator';
import { TipoVistoria, TipoTipologia, TipoUso } from '@prisma/client';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export class CreateVistoriaDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  processoId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  imovelId?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TipoVistoria)
  tipoVistoria?: TipoVistoria = TipoVistoria.presencial;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TipoTipologia)
  tipoTipologia?: TipoTipologia = TipoTipologia.naoEdificado;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TipoUso)
  tipoUso?: TipoUso = TipoUso.residencial;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  qtdePavimentos?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  unifamiliar?: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  multifamiliar?: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  comercio?: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  servico?: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  industria?: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  usoFachadaBoaCondicao?: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  usoEsquadriaBoaCondicao?: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  usoPodaVegetacao?: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  areaConstruidaTotalConstatada?: number;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  areaLoteTotalConstatada?: number;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  indiceOcupacaoConstatado?: number;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  areaCoberturaTotalConstatada?: number;

  @ApiProperty()
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

  @ApiHideProperty()
  @IsOptional()
  vistoriaImovelId?: number;
}
