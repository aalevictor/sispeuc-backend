import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProspeccaoDto } from './create-prospeccao.dto';

export class CreateManyProspeccaoDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProspeccaoDto)
  records: CreateProspeccaoDto[];
}
