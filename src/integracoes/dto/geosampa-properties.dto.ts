import { ApiProperty } from '@nestjs/swagger';

export class GeosampaPropertiesDto {
  @ApiProperty({ example: 2748171 })
  cd_identificador: number;

  @ApiProperty({ example: 9221816 })
  cd_identificador_original_lote: number;

  @ApiProperty({ example: '055' })
  cd_setor_fiscal: string;

  @ApiProperty({ example: 'F' })
  cd_tipo_quadra: string;

  @ApiProperty({ example: 'FISCAL' })
  tx_tipo_quadra: string;

  @ApiProperty({ example: '072' })
  cd_quadra_fiscal: string;

  @ApiProperty({ example: null })
  cd_subquadra_fiscal: string;

  @ApiProperty({ example: '00' })
  cd_condominio: string;

  @ApiProperty({ example: 'F' })
  cd_tipo_lote: string;

  @ApiProperty({ example: 'FISCAL' })
  tx_tipo_lote: string;

  @ApiProperty({ example: '0056' })
  cd_lote: string;

  @ApiProperty({ example: 1 })
  cd_situacao: number;

  @ApiProperty({ example: '4' })
  cd_digito_sql: string;

  @ApiProperty({ example: '060879' })
  cd_logradouro: string;

  @ApiProperty({ example: 'R DORALISA' })
  nm_logradouro_completo: string;

  @ApiProperty({ example: '370' })
  cd_numero_porta: string;

  @ApiProperty({ example: null })
  tx_complemento_endereco: string;

  @ApiProperty({ example: 'ATIVO' })
  tx_situ_lote: string;

  @ApiProperty({ example: '14' })
  cd_tipo_uso_imovel: string;

  @ApiProperty({ example: 'Residencial' })
  dc_tipo_uso_imovel: string;

  @ApiProperty({ example: 2 })
  cd_tipo_terreno_imovel: number;

  @ApiProperty({ example: 220 })
  qt_area_terreno: number;

  @ApiProperty({ example: 176 })
  qt_area_construida: number;
}
