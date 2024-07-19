<p align="center">
  <a href="https://www.prefeitura.sp.gov.br/cidade/secretarias/licenciamento/" target="blank"><img src="https://www.prefeitura.sp.gov.br/cidade/secretarias/upload/chamadas/URBANISMO_E_LICENCIAMENTO_HORIZONTAL_FUNDO_CLARO_1665756993.png" width="200" alt="SMUL Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Base de desenvolvimento Backend - SMUL/ATIC</p>

## Descrição

Base de desenvolvimento backend de SMUL/ATIC:

- NESTJS: https://docs.nestjs.com/
- PRISMAIO: https://www.prisma.io/docs/getting-started

## Instalação

```bash
npm install
```

## Criando o arquivo .env

```bash
copy example.env .env
```

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o código gerado para o campo JWT_SECRET no arquivo .env

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o código gerado para o campo RT_SECRET no arquivo .env

## Configurando o banco de dados

No arquivo 'prisma/seed.ts' substitua as informações por suas informações de usuário. E então execute:

Certificar-se de possuir o Docker ou Docker Desktop instalado e em execução.
Usar a imagem disponibilizada em docker-compose, que é multiplataforma AMD64 e ARM64 e possui a extensão geoespacial PostGIS.
Caso não use esta imagem Docker, poderão ocorrer erros nos próximos comandos prisma, pois os schemas disponibilizados usufruem de comandos geoespaciais

```bash
docker-compose up -d
```

Comandos opcionais para verificar/instalar a extensão PostGIS e para verificar as extensões instaladas, respectivamente.

```bash
docker exec -it postgres bash -c "su - postgres -c 'psql -d smul -c \"CREATE EXTENSION IF NOT EXISTS postgis;\"'"
docker exec -it postgres bash -c "su - postgres -c 'psql -d smul -c \"\\dx\"'"
```

Usar a flag 'schema', sem extensão '.prisma', pois o caminho é um diretório (onde todos os arquivos \*.prisma são lidos)

```bash
npx prisma migrate dev --schema=prisma/schema
```

Usar a flag 'schema', sem extensão '.prisma', pois o caminho é um diretório (onde todos os arquivos \*.prisma são lidos)

```bash
npx prisma generate --schema=prisma/schema
npx prisma generate --schema=prisma2/schema.prisma
```

```bash
npx prisma db seed
```

Para verificar o banco de dados. O Prisma Studio não exibe campos não suportados, como por exemplo, 'geography'.

```bash
npx prisma studio --schema=prisma/schema
```

Como verificar os campos geography?

```bash
docker exec -it postgres bash
su - postgres
psql -d smul
\d "ApiGeosampa"
INSERT INTO "ApiGeosampa" ("geoLatLong", "geoEpsg") VALUES (ST_SetSRID(ST_MakePoint(-46.63500727700612, -23.545555215519084), 4326), 4326);

SELECT * FROM "ApiGeosampa" LIMIT 5;
SELECT id, ST_AsText("geoLatLong") AS geoLatLongText, "geoEpsg" FROM "ApiGeosampa" LIMIT 5;
```

## Rodando a aplicação

Por padrão, a aplicação rodará na porta 3000.

```bash
# atualiza a cada mudança nos arquivos
npm run dev
```

```bash
# modo de desenvolvimento
npm run start
```

```bash
# modo de produção
npm run prod
```

docker-compose up -d
