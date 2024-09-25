import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDecimal,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { TipoVistoria, TipoTipologia, TipoUso } from '@prisma/client';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateVistoriaDto {
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

  @ApiHideProperty()
  @IsOptional()
  vistoriaImovelId?: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  files?: Array<Express.Multer.File>;
}
