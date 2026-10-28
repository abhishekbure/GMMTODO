# Software Design Document (SDD): Authentication and Auditing Foundation

## 1. Overview
This document defines the technical design for the Authentication and Auditing Foundation (GMM-EP-001). This module provides the core security (JWT, Rate Limiting) and observability (Audit Logging) capabilities required by the system.

## 2. Components

### 2.1 Authentication Module
- **`JsonWebTokenUtil` (`app/auth/jwt.util.ts`)**: High-level wrapper for `jsonwebtoken`. Handles signing, verification, and payload decoding.
- **`AuthService` (`app/auth/auth.service.ts`)**: Business logic for validating credentials (using `config.auth.mockUser` for this phase), generating token pairs, and managing session state.
- **`AuthController` (`app/auth/auth.controller.ts`)**: Express endpoints for `login`, `refresh`, and `logout`. Responsible for setting `httpOnly` cookies.
- **`authMiddleware` (`app/auth/auth.middleware.ts`)**: Middleware that validates the presence and integrity of the access token in cookies, injecting the user object into the `Request`.

### 2.2 Auditing Module
- **`AuditLogger` (`app/audit/audit.logger.ts`)**: An abstraction layer to decouple the application from specific logging implementations.
- **`AuditService` (`app/audit/audit.service.ts`)**: Orchestrates the creation and persistence of audit events.

### 2.3 Security Infrastructure
- **`rateLimiter` (`app/middleware/rate_limiter.ts`)**: IP-based rate limiting middleware using an in-memory `Map`.
- **`config` (`app/config/config.ts`)**: Centralized configuration with environment variable validation.

## 3. Data Flow

### 3.1 Authentication Flow (Login)
1. Client sends `POST /api/v1/auth/login` with credentials.
2. `AuthController` calls `AuthService.login`.
3. `AuthService` verifies credentials.
4. `AuthService` calls `JsonWebTokenUtil` to generate an Access Token (15m) and a Refresh Token (7d).
5. `AuthController` sets both tokens as `httpOnly` cookies in the response.
6. `AuditService` records the successful/failed login event.

### 3.2 Protected Resource Access
1. Client sends request with cookie.
2. `authMiddleware` intercepts request.
3. `authMiddleware` calls `JsonWebTokenUtil.verify`.
4. If valid, `user` context is added to `req`.
5. If invalid/missing, returns `401 Unauthorized`.

## 4. NFR Tactics

### 4.1 Security
- **Tactic: Mitigation of XSS via `httpOnly` Cookies.** 
  - Tokens are never accessible to client-side JavaScript.
- **Tactic: Mitigation of Brute Force via Rate Limiting.** 
  - `rateLimiter` restricts attempts to 10 per minute per IP.
- **Tactic: Principle of Least Privilege (Tokens).**
  - Short-lived access tokens (15m) minimize the window of opportunity for stolen tokens.

### 4.2 Reliability
- **Tactic: Fail-fast Configuration.**
  - `app/config/config.ts` throws errors on startup if critical environment variables (e.g., `JWT_SECRET`) are missing.

### 4.3 Maintainability
- **Tactic: Centralized Configuration.**
  - All environment-dependent values are managed through a single `config` object.

## 5. Operability Design

### 5.1 Rate Limiter
- **SLI**: Success rate of requests under rate limit vs. blocked requests.
- **Logs**: `rate_limit_exceeded` event (IP, timestamp).
- **Alerts**: High rate of `429 Too Many Requests` from a single IP.
- **Rollback**: Disable via config if misconfigured.

### 5.2 Audit Service
- **SLI**: Audit event latency (time from event occurrence to log persistence).
- **Logs**: `audit_event_recorded` (event_type, user_id, timestamp).
- **Alerts**: Audit log service failure (critical).
- **Rollback**: Switch to fallback console logger if DB is unavailable.
