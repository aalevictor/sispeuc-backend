import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { PrismaModule } from './prisma/prisma.module';
import { Prisma2Module } from './prisma2/prisma2.module';
import { VitalidadeModule } from './vitalidade/vitalidade.module';
import { ConfigModule } from '@nestjs/config';
import { CadastrosModule } from './cadastros/cadastros.module';
import { IntegracoesModule } from './integracoes/integracoes.module';
import { VistoriasModule } from './vistorias/vistorias.module';
import { ProspeccoesModule } from './prospeccoes/prospeccoes.module';
import { SalvaguardaModule } from './salvaguarda/salvaguarda.module';

@Global()
@Module({
  imports: [
    UsuariosModule,
    AuthModule,
    PrismaModule,
    Prisma2Module,
    VitalidadeModule,
    SalvaguardaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CadastrosModule,
    IntegracoesModule,
    VistoriasModule,
    ProspeccoesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    // SalvaguardaModule,
  ],
  exports: [AppService],
})
export class AppModule {}
