import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const usuario: Usuario = request.user || { login: 'usuário_anônimo' };
    const method = request.method;
    const route = request.route.path;

    const nomeRota = this.getRouteNameFromRoute(route);
    const acaoTipo = this.getAcaoTipo(method);
    const registroTipo = this.getRegistroTipo(route);

    return next.handle().pipe(
      tap(async (result) => {
        if (!nomeRota) {
          console.warn('AuditInterceptor: Nome da tabela não encontrado.');
          return;
        }

        const registroId = this.parseRegistroId(
          this.extractIdFromResult(result, request),
        );
        const alteracao = this.extractAlteracao(result, request);

        try {
          await this.prisma.auditoria.create({
            data: {
              nomeRota,
              usuarioId: usuario.login,
              acaoTipo,
              registroTipo,
              alteracao,
              registroId,
            },
          });
        } catch (error) {
          console.error('Erro ao criar registro de auditoria:', error);
        }
      }),
    );
  }

  private getRouteNameFromRoute(route: string): string {
    const cadastroPattern = /\/cadastros?/i;
    const processoPattern = /\/processos?/i;
    const vistoriaPattern = /\/vistorias?/i;
    const prospeccaoPattern = /\/prospeccoes?/i;

    if (cadastroPattern.test(route)) return 'cadastro';
    if (processoPattern.test(route)) return 'processo';
    if (vistoriaPattern.test(route)) return 'vistoria';
    if (prospeccaoPattern.test(route)) return 'prospeccao';

    return 'Tabela Desconhecida';
  }

  private getAcaoTipo(method: string): string {
    switch (method) {
      case 'POST':
        return 'criou';
      case 'PATCH':
        return 'atualizou';
      case 'DELETE':
        return 'excluiu';
      case 'GET':
        return 'consultou';
      default:
        return 'executou uma ação desconhecida';
    }
  }

  private getRegistroTipo(route: string): string {
    const cleanRoute = route.split('?')[0];
    const parts = cleanRoute.split('/').filter(Boolean);
    const formattedParts = parts.map((part) =>
      !isNaN(Number(part)) ? `:id` : part,
    );
    return formattedParts.join('/');
  }

  private extractIdFromResult(
    result: any,
    request: any,
  ): string | number | null {
    return result?.id || request.params?.id || request.body?.id || null;
  }

  private parseRegistroId(id: string | number | null): number | null {
    const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;
    return isNaN(parsedId) ? null : parsedId;
  }

  private extractAlteracao(result: any, request: any): any {
    return result?.data
      ? JSON.parse(JSON.stringify(result.data))
      : JSON.parse(JSON.stringify(request.body));
  }
}
