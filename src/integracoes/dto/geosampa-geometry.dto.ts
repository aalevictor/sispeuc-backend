import { ApiProperty } from '@nestjs/swagger';

export class GeosampaGeometryDto {
  @ApiProperty({ example: 'Polygon' })
  type: string;

  @ApiProperty({
    example: [
      [
        [342917.20540278, 7394577.98363141],
        [342915.66010151, 7394574.84812713],
        [342908.39089554, 7394560.09800701],
        [342918.05530866, 7394555.33520306],
        [342919.16210957, 7394557.58090612],
        [342926.37601551, 7394572.21882609],
        [342925.68021427, 7394573.93532811],
        [342922.92391053, 7394575.25202918],
        [342917.20540278, 7394577.98363141],
      ],
    ],
  })
  coordinates: number[][][];
}
