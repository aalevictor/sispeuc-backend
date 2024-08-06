import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class IntegracoesGeosampaService {
  private baseUrl: string;
  private layerName: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('GEOSAMPA_WFS_BASE_URL');
    this.layerName = this.configService.get<string>('GEOSAMPA_WFS_LAYER_NAME');
  }

  findOne(id: string) {
    return this.fetchGeosampaData(id);
  }

  private buildCqlFilter(id: string): string {
    const cdSetorFiscal = id.slice(0, 3);
    const cdQuadraFiscal = id.slice(4, 7);
    const cdLote = id.slice(8, 12);
    const cdDigitoSql = id[13] !== '-' ? id.slice(13) : null;

    let filter = `cd_setor_fiscal='${cdSetorFiscal}' AND cd_quadra_fiscal='${cdQuadraFiscal}' AND cd_lote='${cdLote}'`;
    filter += cdDigitoSql
      ? ` AND cd_digito_sql='${cdDigitoSql}'`
      : ` AND cd_digito_sql IS NULL`;
    return filter;
  }

  private async fetchGeosampaData(id: string) {
    const cqlFilter = this.buildCqlFilter(id);
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeNames: this.layerName,
      outputFormat: 'application/json',
      CQL_FILTER: cqlFilter,
    });

    const url = `${this.baseUrl}?${params.toString()}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from Geosampa:', error);
      throw new Error('Failed to fetch data from Geosampa');
    }
  }
}
