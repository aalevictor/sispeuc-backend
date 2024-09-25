import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer } from 'ldapjs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });

  app.enableCors({
    origin: 'http://localhost:3001',
  });

  // app.useGlobalPipes(
  // new ValidationPipe({
  //     whitelist: true, // Remove qualquer propriedade do corpo da requisição que não esteja explicitamente definida no DTO.
  //     forbidNonWhitelisted: true, // Lança um erro se houver quaisquer propriedades no corpo da requisição que não estejam definidas no DTO.
  // transform: true, // Converte automaticamente os tipos das propriedades no corpo da requisição para corresponder aos tipos definidos no DTO. Ex: "123" para 123
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );

  // OpenAPI (Swagger) documentation
  const options = new DocumentBuilder()
    .setTitle('SISPEUC')
    .setDescription(
      'O sistema moderno para aplicação das leis de Parcelamento, Edificação e Utilização Compulsórios da Prefeitura Municipal de São Paulo!',
    )
    .setVersion('versão 2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  // App URL
  console.log(`Application is running on: ${await app.getUrl()}/api`);

  // LDAP connection
  const server = createServer();
  server.listen(1389, () => {
    console.log('LDAP server listening at %s', server.url);
  });
}
bootstrap();
