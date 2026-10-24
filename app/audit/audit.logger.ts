class AuditLogger:
  def __init__(self, audit_service):
    self.audit_service = audit_service

  async def log(self, actor_id, resource_id, event_type, delta):
    await self.audit_service.log_event(actor_id, resource_id, event_type, delta)
