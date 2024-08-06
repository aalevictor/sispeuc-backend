import { ApiProperty } from '@nestjs/swagger';
import { GeosampaGeometryDto } from './geosampa-geometry.dto';
import { GeosampaPropertiesDto } from './geosampa-properties.dto';

export class GeosampaFeatureDto {
  @ApiProperty({ example: 'Feature' })
  type: string;

  @ApiProperty({ example: 'lote_cidadao.2748171' })
  id: string;

  @ApiProperty({ type: GeosampaGeometryDto })
  geometry: GeosampaGeometryDto;

  @ApiProperty({ example: 'ge_poligono' })
  geometry_name: string;

  @ApiProperty({ type: GeosampaPropertiesDto })
  properties: GeosampaPropertiesDto;
}
