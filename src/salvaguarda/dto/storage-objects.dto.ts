import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class StorageObjectsDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ type: 'string', format: 'number', required: false })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  files: Array<Express.Multer.File>;
}
