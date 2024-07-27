import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
// import { off } from 'process';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Número de itens por página.',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: number = 10;

  @ApiProperty({
    description: 'Número da página.',
    required: false,
    default: 0,
  })
  offset?: number = 0;

  // @IsOptional()
  // @IsPositive()
  // limit: number;

  // @IsOptional()
  // @IsPositive()
  // offset: number;
}
