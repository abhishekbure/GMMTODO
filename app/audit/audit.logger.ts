import { AuditService } from './audit.service';

export class AuditLogger {
  constructor(private auditService: AuditService) {}

  async log(actorId: string, resourceId: string, eventType: string, delta: any): Promise<void> {
    await this.auditService.logEvent({ actorId, resourceId, eventType, delta });
  }
}
