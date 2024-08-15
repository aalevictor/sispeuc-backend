import { SetMetadata } from '@nestjs/common';

export const AUDIT_TABLE = 'AUDIT_TABLE';

export const AuditTable = (tableName: string) =>
  SetMetadata(AUDIT_TABLE, tableName);
