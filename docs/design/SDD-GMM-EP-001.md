# SDD-GMM-EP-001: Authentication and Auditing Foundation

## 1. Overview
This document defines the technical architecture for the Authentication and Auditing Foundation (GMM-EP-001). It establishes the security primitives for user sessions and the observability foundation for system mutations.

## 2. Components

### 2.1 Authentication Module (`app/auth/`)
- **`jwt.util.ts`**: A stateless utility for signing and verifying JWTs. It manages Access Tokens (15m) and Refresh Tokens (7d).
- **`auth.service.ts`**: Orchestrates credential verification and token lifecycle management.
- **`auth.controller.ts`**: Express-based REST endpoints for `/login`, `/refresh`, and `/logout`.
- **`auth.middleware.ts`**: An Express middleware to protect routes, validate tokens, and populate the request context with user identity.

### 2.2 Auditing Module (`app/audit/`)
- **`audit.service.ts`**: The primary service for recording system events.
- **`audit.schema.ts`**: Defines the data structure for the `AuditLog` entity.
- **Database Immutability**: Implemented via PostgreSQL permissions and triggers to ensure an append-only log.

### 2.3 Security Middleware (`app/middleware/`)
- **`rate_limiter.ts`**: IP-based rate limiting to mitigate brute-force attacks on the login endpoint.

## 3. Data Flow

### 3.1 Authentication Flow (Login)
1. Client sends `POST /api/v1/auth/login` with credentials.
2. `auth.controller.ts` calls `auth.service.ts`.
3. `auth.service.ts` verifies credentials and calls `jwt.util.ts`.
4. `jwt.util.ts` returns a `TokenPair`.
5. `auth.controller.ts` sets the Access Token and Refresh Token in `httpOnly` cookies.
6. Client receives 200 OK.

### 3.2 Authorization Flow (Protected Resource)
1. Client sends request with JWT in cookie.
2. `auth.middleware.ts` intercepts request.
3. `auth.middleware.ts` calls `jwt.util.ts` to validate the signature and expiration.
4. If valid, the user identity is attached to `req.user`.
5. If invalid/expired, 401 Unauthorized is returned.

### 3.3 Audit Flow (System Mutation)
1. Any service performing a mutation calls `audit.service.logEvent()`.
2. The event (actor, resource, delta, timestamp) is persisted to the `AuditLog` table.
3. Database triggers prevent any `UPDATE` or `DELETE` on this table.

## 4. NFR Tactics

### 4.1 Security
- **Tactic**: Token Storage. Use `httpOnly` and `Secure` flags for cookies to mitigate XSS.
- **Tactic**: Brute-force mitigation. Implement IP-based rate limiting (10 req/min) on auth endpoints.
- **Tactic**: Data Integrity. Use database triggers to enforce an immutable, append-only audit trail.

### 4.2 Performance Efficiency
- **Tactic**: Latency. Ensure JWT validation and token issuance (p95) occurs within < 300ms.

### 4.3 Reliability
- **Tactic**: Session Management. Implement Refresh Token rotation to minimize the impact of stolen access tokens.

## 5. Operability Design

### 5.1 Auth Endpoints
- **SLIs**: 
    - Availability: Success rate of `/login` and `/refresh` endpoints.
    - Latency: p95 latency of `/login` < 300ms.
- **Logs**: 
    - `AUTH_LOGIN_SUCCESS`: User ID, IP.
    - `AUTH_LOGIN_FAILURE`: Attempted username, IP, Reason (invalid credentials/rate-limited).
    - `AUTH_TOKEN_REFRESH`: User ID.
- **Alerts**: 
    - High rate of `AUTH_LOGIN_FAILURE` from a single IP (potential brute force).
    - Spike in 401/403 responses (potential token expiration/invalidation issue).
- **Rollback**: Revert deployment to the previous stable container image.

### 5.2 Audit Service
- **SLIs**: 
    - Durability: Successful writes to the `AuditLog` table.
- **Logs**: 
    - `AUDIT_WRITE_SUCCESS`: Event type, resource ID.
    - `AUDIT_WRITE_FAILURE`: Error details (database connection issues).
- **Alerts**: 
    - `AUDIT_WRITE_FAILURE` count > 0 (critical loss of observability).
- **Rollback**: Revert deployment to previous stable container image.
