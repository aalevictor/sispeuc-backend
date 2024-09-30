import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAssetsDto {
  @IsString()
  nomeArquivo: string;

  @IsString()
  tipo: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  etiqueta?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsBoolean()
  legalHold?: boolean;

  @IsOptional()
  @IsString()
  usuarioId?: string;
}
