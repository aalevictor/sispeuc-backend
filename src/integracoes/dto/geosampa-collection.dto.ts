import { ApiProperty } from '@nestjs/swagger';
import { GeosampaFeatureDto } from './geosampa-feature.dto';

export class GeosampaCollectionDto {
  @ApiProperty({ example: 'Collection' })
  type: string;

  @ApiProperty({ type: [GeosampaFeatureDto] })
  features: GeosampaFeatureDto[];
}
