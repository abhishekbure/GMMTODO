# Architecture Decision Records (ADR)

## ADR-001: JWT Token Lifecycle and Storage
**Status**: Proposed
**Context**: The system requires secure authentication. We need to decide on token expiration and how they are delivered to the client.
**Options**:
1. **Option A: Short-lived Access Tokens + Long-lived Refresh Tokens via HTTP-only Cookies.** (Recommended)
   - *Pros*: High security against XSS (cookies are inaccessible to JS), supports session rotation.
   - *Cons*: Requires cookie management in the backend; slightly more complex logout logic.
2. **Option B: Short-lived Access Tokens in LocalStorage.**
   - *Pros*: Easy to implement for SPAs.
   - *Cons*: High risk of XSS-based token theft.
**Decision**: Option A. Tokens will be delivered via `httpOnly` cookies to mitigate XSS. Access tokens expire in 15m, Refresh tokens in 7d.
**Consequences**: Backend must manage cookie headers; CSRF protection becomes a requirement for subsequent development.

## ADR-002: Audit Log Implementation Strategy
**Status**: Proposed
**Context**: The system needs an immutable audit log for compliance.
**Options**:
1. **Option A: Append-only Database Table (PostgreSQL).** (Recommended)
   - *Pros*: Relational integrity, transactional consistency, easy to query.
   - *Cons*: Requires careful permissioning to prevent deletion/updates.
2. **Option B: File-based logging (Log files).**
   - *Pros*: Extremely fast, low overhead.
   - *Cons*: Harder to aggregate/query in real-time; harder to guarantee immutability at the application level.
**Decision**: Option A. Audit logs will be stored in a PostgreSQL table with strict application-level constraints to ensure append-only behavior.
**Consequences**: Adds a dependency on PostgreSQL for the audit service.

## ADR-003: Rate Limiting Mechanism
**Status**: Proposed
**Context**: Prevent brute force attacks on the login endpoint.
**Options**:
1. **Option A: In-memory Map-based tracking.**
   - *Pros*: Simple, no external dependencies.
   - *Cons*: Not scalable across multiple server instances (local to one process).
2. **Option B: Redis-based distributed rate limiting.**
   - *Pros*: Scalable, shared state across instances.
   - *Cons*: Adds complexity and a Redis dependency.
**Decision**: Option A for this initial implementation to minimize infrastructure complexity for the foundation.
**Consequences**: Rate limiting is local to the individual server node.
