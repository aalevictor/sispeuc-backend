import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class SalvaguardaService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    entityId?: string,
  ): Promise<string> {
    // Sanitiza o nome do arquivo, removendo acentos e caracteres especiais
    const sanitizedFileName = file.originalname
      .normalize('NFD') // Normaliza o nome do arquivo
      .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^a-zA-Z0-9.-]/g, ''); // Remove caracteres não alfanuméricos

    // Cria o nome do arquivo final, adicionando um timestamp, nome customizado, nome do arquivo e a extensão
    const fileName = `${Date.now()}-${entityId}-${sanitizedFileName}`;

    // Faz o upload do arquivo para o MinIO
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );

    // Retorna a URL dinâmica, baseada em parametros.
    const useSSL = this.configService.get('MINIO_USE_SSL') === 'true';
    return `${useSSL ? 'https://' : 'http://'}${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.bucketName}/${fileName}`;
  }

  async getFileUrl(fileName: string): Promise<string> {
    const expires = 72 * 60 * 60;
    const presignedUrl = await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
      expires,
    );

    return presignedUrl;
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
