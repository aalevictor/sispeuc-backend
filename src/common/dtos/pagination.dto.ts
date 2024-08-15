import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsEnum, IsNotEmpty } from 'class-validator';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export enum OrderByFields {
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
    enum: OrderByFields,
    default: OrderByFields.ATUALIZADO_EM,
  })
  @IsOptional()
  @IsEnum(OrderByFields)
  orderBy?: OrderByFields = OrderByFields.ATUALIZADO_EM;

  @ApiProperty({
    description: 'Ordem da ordenação.',
    required: false,
    enum: Order,
    default: Order.ASC,
  })
  @IsNotEmpty()
  @IsEnum(Order)
  order?: Order = Order.ASC;
}
