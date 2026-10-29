"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
class AuditService {
    async logEvent(event) {
        // In a real implementation, this would persist to PostgreSQL
        const sanitizedDelta = JSON.parse(JSON.stringify(event.delta));
        console.log(`[AUDIT] ${event.eventType} by ${event.actorId} on ${event.resourceId}:`, sanitizedDelta);
    }
}
exports.AuditService = AuditService;
