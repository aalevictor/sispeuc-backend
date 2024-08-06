import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GeosampaCollectionDto } from './dto/geosampa-collection.dto';
import { GeosampaFeatureDto } from './dto/geosampa-feature.dto';

@Injectable()
export class GeosampaService {
  private baseUrl: string;
  private layerName: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('GEOSAMPA_WFS_BASE_URL');
    this.layerName = this.configService.get<string>('GEOSAMPA_WFS_LAYER_NAME');
  }

  async findOneLote(sql: string): Promise<GeosampaFeatureDto> {
    // Normalizar a entrada SQL: Remover pontos e traços
    const normalizedSql = sql.replace(/[.\-]/g, '');

    // Garantir que o código SQL normalizado tenha exatamente 11 dígitos
    const sqlCodeRegex = /^\d{11}$/;
    if (!sqlCodeRegex.test(normalizedSql)) {
      throw new BadRequestException(
        'Formato SQL Inválido. O código SQL deve conter 11 dígitos numéricos.',
      );
    }

    // Validar o dígito verificador (DV)
    const baseNumber = normalizedSql.slice(0, 10);
    const givenDv = normalizedSql[10];

    const calculatedDv = this.calculateCheckDigit(baseNumber);
    if (calculatedDv !== parseInt(givenDv, 10)) {
      throw new BadRequestException(
        'Formato SQL Inválido. O dígito verificador não confere.',
      );
    }

    // Construir o filtro CQL com o código SQL formatado
    const cqlFilter = this.buildCqlFilter(normalizedSql);
    const url = this.buildUrl(cqlFilter);

    // Buscar dados do Geosampa
    const data = await this.fetchGeosampaData(url);
    return data.features[0];
  }

  // Método para construir o filtro CQL a partir do código SQL normalizado
  private buildCqlFilter(sql: string): string {
    const cdSetorFiscal = sql.slice(0, 3);
    const cdQuadraFiscal = sql.slice(3, 6);
    const cdLote = sql.slice(6, 10);
    const cdDigitoSql = sql.slice(10);

    let filter = `cd_setor_fiscal='${cdSetorFiscal}' AND cd_quadra_fiscal='${cdQuadraFiscal}' AND cd_lote='${cdLote}'`;
    filter += cdDigitoSql
      ? ` AND cd_digito_sql='${cdDigitoSql}'`
      : ` AND cd_digito_sql IS NULL`;
    return filter;
  }

  // Calcular o dígito verificador (DV) para o número do IPTU
  private calculateCheckDigit(baseNumber: string): number {
    const weights = [10, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let sum = 0;

    for (let i = 0; i < baseNumber.length; i++) {
      sum += parseInt(baseNumber[i], 10) * weights[i];
    }

    const remainder = sum % 11;
    return remainder === 10 ? 1 : remainder;
  }

  // Isso solicitará um único recurso do Geosampa passando o código SQL de 11 dígitos, o que significa cdSetorFiscal + cdQuadraFiscal neste formato: 'SSSQQQ'. Precisa aceitar 6 dígitos sem pontos e traços.
  async findAllLotesInQuadra(id: string): Promise<GeosampaCollectionDto> {
    // Garantir que 'id' tenha exatamente 6 dígitos
    // Normalizar o ID removendo todos os caracteres não numéricos
    const normalizedId = id.replace(/\D/g, '');

    // Garantir que 'id' tenha exatamente 6 dígitos e contenha apenas números
    if (!/^\d{6}$/.test(normalizedId)) {
      throw new BadRequestException(
        'Formato Inválido. O código deve conter exatamente 6 dígitos numéricos.',
      );
    }

    // Dividir o ID em cd_setor_fiscal e cd_quadra_fiscal
    const cdSetorFiscal = normalizedId.slice(0, 3);
    const cdQuadraFiscal = normalizedId.slice(3);

    // Construir o filtro CQL com base no ID dividido
    const cqlFilter = `cd_setor_fiscal='${cdSetorFiscal}' AND cd_quadra_fiscal='${cdQuadraFiscal}'`;
    const url = this.buildUrl(cqlFilter);
    return this.fetchGeosampaData(url);
  }

  async findAllQuadrasInSetor(id: string): Promise<GeosampaCollectionDto> {
    // Garantir que 'id' tenha exatamente 3 dígitos
    const normalizedId = id.replace(/\D/g, '');

    // Garantir que 'id' tenha exatamente 3 dígitos e contenha apenas números
    if (!/^\d{3}$/.test(normalizedId)) {
      throw new BadRequestException(
        'Formato Inválido. O código deve conter exatamente 3 dígitos numéricos.',
      );
    }

    // Construir o filtro CQL com base no ID de 3 dígitos
    const cqlFilter = `cd_setor_fiscal='${normalizedId}'`;
    const url = this.buildUrl(cqlFilter);
    return this.fetchGeosampaData(url);
  }

  private buildUrl(cqlFilter: string): string {
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeNames: this.layerName,
      outputFormat: 'application/json',
      CQL_FILTER: cqlFilter,
    });

    return `${this.baseUrl}?${params.toString()}`;
  }

  private async fetchGeosampaData(url: string): Promise<GeosampaCollectionDto> {
    try {
      const response = await axios.get<GeosampaCollectionDto>(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do Geosampa:', error);
      throw new Error('Falha ao buscar dados do Geosampa');
    }
  }
}
