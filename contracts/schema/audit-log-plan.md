# Audit Log Schema Plan

## Overview
This document outlines the schema and immutability requirements for the `AuditLog` table.

## Schema Definition
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary Key |
| `actor_id` | UUID | ID of the user/system performing the action |
| `timestamp` | TIMESTAMP | ISO8601 timestamp of the event |
| `resource_id` | UUID | The ID of the object being mutated |
| `delta` | JSONB | The change details (before/after or specific fields) |
| `event_type` | VARCHAR | e.g., 'CREATE', 'UPDATE', 'DELETE' |

## Immutability Requirements
- **Append-Only**: The database user for the application must only have `INSERT` and `SELECT` permissions on the `AuditLog` table.
- **Triggers**: A database trigger should prevent `UPDATE` or `DELETE` operations on the `AuditLog` table, raising an exception if attempted.
- **Integrity**: The log must be verifiable and cannot be retroactively altered.
