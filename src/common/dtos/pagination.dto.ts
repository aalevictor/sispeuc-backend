import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export enum OrderBy {
  CRIADO_EM = 'criadoEm',
  ATUALIZADO_EM = 'atualizadoEm',
}

export class PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: number = 10;

  @ApiProperty({
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({
    description: 'Campo para ordenação.',
    required: false,
    enum: OrderBy,
    default: OrderBy.ATUALIZADO_EM,
  })
  @IsEnum(OrderBy)
  orderBy?: OrderBy = OrderBy.ATUALIZADO_EM;

  @ApiProperty({
    description: 'Ordem da ordenação.',
    required: false,
    enum: Order,
    default: Order.ASC,
  })
  @IsEnum(Order)
  order?: Order = Order.ASC;
}
