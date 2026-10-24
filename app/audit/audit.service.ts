
import { Request, Response } from 'express';

export interface AuditEvent {
  actorId: string;
  resourceId: string;
  eventType: string;
  delta: any;
}

export class AuditService {
  async logEvent(event: AuditEvent): Promise<void> {
    // In a real implementation, this would persist to PostgreSQL
    console.log(`[AUDIT] ${event.eventType} by ${event.actorId} on ${event.resourceId}:`, event.delta);
  }
}

export class AuditLogger {
  constructor(private auditService: AuditService) {}

  async log(actorId: string, resourceId: string, eventType: string, delta: any): Promise<void> {
    await this.auditService.logEvent({ actorId, resourceId, eventType, delta });
  }
}
