import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVistoria2Dto {
  @IsString()
  processoId: string;

  @IsString()
  imovelId: string;

  @IsString()
  qtdePavimentos: string;

  @IsBoolean()
  unifamiliar: boolean;

  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  files: Array<Express.Multer.File>;

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateAsset2Dto) // Ensure correct mapping
  // VistoriaAsset: CreateAsset2Dto[];
}
