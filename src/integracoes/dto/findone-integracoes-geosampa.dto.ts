import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneDto {
  @ApiProperty({
    description: 'O formato deve ser: 999.999.9999-9',
    example: '027.026.0019-0',
  })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{4}-\d$/, {
    message: 'O formato deve ser: 999.999.9999-9',
  })
  id: string;
}
