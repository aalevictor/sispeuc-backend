import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class SalvaguardaService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.initializeMinioClient();
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
  }

  async createBucketIfNotExists(): Promise<void> {
    const bucketExists = await this.bucketExists();
    if (!bucketExists) {
      await this.createBucket();
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    entityId?: string,
  ): Promise<string> {
    const fileName = this.generateFileName(file.originalname, entityId);
    await this.uploadToMinio(file, fileName);
    return this.generateFileUrl(fileName);
  }

  async getFileUrl(fileName: string): Promise<string> {
    return this.generatePresignedUrl(fileName);
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  private initializeMinioClient(): void {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
  }

  private async bucketExists(): Promise<boolean> {
    return await this.minioClient.bucketExists(this.bucketName);
  }

  private async createBucket(): Promise<void> {
    await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
  }

  private generateFileName(originalName: string, entityId?: string): string {
    const sanitizedFileName = this.sanitizeFileName(originalName);
    return `${Date.now()}-${entityId || ''}-${sanitizedFileName}`;
  }

  private sanitizeFileName(originalName: string): string {
    return originalName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '');
  }

  private async uploadToMinio(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<void> {
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );
  }

  private generateFileUrl(fileName: string): string {
    const useSSL = this.configService.get('MINIO_USE_SSL') === 'true';
    const endPoint = this.configService.get('MINIO_ENDPOINT');
    const port = this.configService.get('MINIO_PORT');
    return `${useSSL ? 'https://' : 'http://'}${endPoint}:${port}/${this.bucketName}/${fileName}`;
  }

  private async generatePresignedUrl(fileName: string): Promise<string> {
    const expires = +process.env.MINIO_PRIVATE_URL_EXPIRE_TIME;
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
      expires,
    );
  }

  async removeFileFromMinio(fileUrl: string): Promise<void> {
    try {
      const url = new URL(fileUrl);
      const objectKey = url.pathname.replace(/^\/sispeucdev\//, '');
      await this.minioClient.removeObject(
        process.env.MINIO_BUCKET_NAME,
        objectKey,
      );
      // console.log(`File deleted successfully: ${objectKey}`);
    } catch (error) {
      console.error('Error deleting file from Minio:', error);
    }
  }
}
