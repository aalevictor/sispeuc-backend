import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, MinLength, IsString } from 'class-validator';

export class CreateProcessoDto {
  // @ApiProperty()
  // imovelId?: number;

  // @ApiProperty()
  // vistoriaId?: number;

  @ApiProperty()
  autuacaoSei?: number;

  @ApiProperty()
  autuacaoData?: Date;

  @ApiProperty()
  imovelContiguidade: boolean = false;

  @MinLength(20)
  estado?: string;

  @ApiProperty()
  areaConstruidaTotal?: number;

  @ApiProperty()
  areaLoteTotal?: number;

  @ApiProperty({
    description: 'Opções válidas:',
    enum: $Enums.ProspeccaoOrigem,
  })
  @IsEnum($Enums.ProspeccaoOrigem, { message: 'Escolha uma permissão válida.' })
  @IsString({ each: true })
  prospeccaoOrigem?: $Enums.ProspeccaoOrigem;

  @ApiProperty({
    description: 'Opções válidas:',
    enum: $Enums.ProspeccaoTipologia,
  })
  @IsEnum($Enums.ProspeccaoTipologia, {
    message: 'Escolha uma permissão válida.',
  })
  prospeccaoTipologia?: $Enums.ProspeccaoTipologia;

  @ApiProperty()
  prospeccaoData?: Date;

  // usuarioId?: string;
  //  criadoEm?: Date;
  //  atualizadoEm?: Date;
  //  arquivado?: boolean = false;
}
