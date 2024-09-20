import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum SearchType {
  PROCESSO = 'processo',
  IMOVEL = 'imovel',
  VISTORIA = 'vistoria',
}

export class SearchQueryDto {
  @ApiProperty({
    description: 'Selecione o modelo',
    required: false,
    enum: SearchType,
    default: SearchType.IMOVEL,
  })
  @IsEnum(SearchType)
  model?: SearchType = SearchType.IMOVEL;

  @ApiProperty({
    description: `Campos aceitos: \n SQL, Autuação SEI, ID`,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  query: string;
}
