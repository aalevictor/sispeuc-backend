import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AUDIT_TABLE } from 'src/common/decorators/audit-table.decorator';

@Injectable()
export class AuditingInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const usuarioId = request.user.id; // Assuming user is injected in the request

    // Get table name from metadata at the method level
    const handlerTableName = this.reflector.get<string>(
      AUDIT_TABLE,
      context.getHandler(),
    );
    // Get table name from metadata at the controller level
    const classTableName = this.reflector.get<string>(
      AUDIT_TABLE,
      context.getClass(),
    );

    // Use handlerTableName if defined, otherwise fallback to classTableName
    const tableName = handlerTableName || classTableName;

    return next.handle().pipe(
      tap(async (response) => {
        let alteracaoTipo: string;
        switch (method) {
          case 'POST':
            alteracaoTipo = 'CREATE';
            break;
          case 'PUT':
          case 'PATCH':
            alteracaoTipo = 'UPDATE';
            break;
          case 'DELETE':
            alteracaoTipo = 'DELETE';
            break;
          default:
            alteracaoTipo = 'GET';
            break;
        }

        if (
          ['CREATE', 'UPDATE', 'DELETE'].includes(alteracaoTipo) &&
          tableName
        ) {
          const plainResponse = JSON.parse(JSON.stringify(response));
          await this.prisma.auditoria.create({
            data: {
              nomeTabela: tableName,
              registroId: response.id,
              usuarioId: usuarioId,
              alteracaoTipo: alteracaoTipo,
              alteracao: plainResponse,
            },
          });
        }
      }),
    );
  }
}
