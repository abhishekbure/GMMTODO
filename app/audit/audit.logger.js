"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogger = void 0;
class AuditLogger {
    constructor(auditService) {
        this.auditService = auditService;
    }
    async log(actorId, resourceId, eventType, delta) {
        await this.auditService.logEvent({ actorId, resourceId, eventType, delta });
    }
}
exports.AuditLogger = AuditLogger;
