import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StorageObjectDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ type: 'string', format: 'number', required: false })
  @IsNumber()
  @IsOptional()
  outletId?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsString()
  @IsOptional()
  file?: Express.Multer.File;
}
