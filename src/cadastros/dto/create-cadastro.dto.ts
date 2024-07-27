import { CreateProcessoDto } from './create-processo.dto';
import { CreateImovelDto } from './create-imovel.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCadastroDto {
  @ValidateNested()
  @Type(() => CreateProcessoDto)
  processo: CreateProcessoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImovelDto)
  imovel: CreateImovelDto[];
}

// export class CreateCadastroDto {
//   @ApiProperty({ type: CreateProcessoDto })
//   processo: CreateProcessoDto;

//   @ApiProperty({ type: CreateImovelDto })
//   imovel: CreateImovelDto;
// }
