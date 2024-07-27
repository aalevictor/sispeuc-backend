import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Login com ao menos 6 caracteres.' })
  @IsString({ message: 'Login inválido!' })
  @MinLength(6, { message: 'Login tem de ter ao menos 6 caracteres.' })
  login: string;

  @ApiProperty({ description: 'Senha com ao menos 6 caracteres.' })
  @MinLength(6, { message: 'Login tem de ter ao menos 6 caracteres.' })
  senha: string;

  // @ApiProperty({ description: 'Enums do tipo:', enum: $Enums.Permissao })
  // permissao: string;
}
