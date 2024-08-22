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
  comment?: string;

  @ApiProperty({ type: 'string', format: 'number', required: false })
  @IsNumber()
  @IsOptional()
  outletId?: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => File)
  @IsOptional()
  files?: Array<Express.Multer.File>;
}
