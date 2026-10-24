import { AuditService } from './audit.service';

describe('AuditService', () => {
  let auditService: AuditService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    auditService = new AuditService();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log an audit event with sanitized delta', async () => {
    const event = {
      actorId: 'user-1',
      resourceId: 'res-1',
      eventType: 'UPDATE',
      delta: { key: 'value' }
    };

    await auditService.logEvent(event);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[AUDIT] UPDATE by user-1 on res-1:'),
      event.delta
    );
  });
});
