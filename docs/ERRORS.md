# Error Catalog

## HTTP Status Codes

| Code | When | Retry? |
|------|------|--------|
| 400 | Invalid input | No |
| 401 | Not authenticated | No (redirect to login) |
| 403 | Forbidden (not admin) | No |
| 404 | Resource not found | No |
| 409 | Conflict (duplicate) | No |
| 429 | Rate limited | Yes (exponential backoff) |
| 500 | Server error | Yes (max 3 retries) |
| 503 | Service unavailable | Yes (with circuit breaker) |

## Error Codes

```
UNAUTHORIZED       - Auth required
FORBIDDEN          - Insufficient permissions
NOT_FOUND          - Resource missing
VALIDATION_ERROR   - Input validation failed
RATE_LIMITED       - Too many requests
SCRAPER_FAILED     - Scraper encountered error
LLM_ERROR          - AI service unavailable
DB_ERROR           - Database operation failed
```

## Retry Policy
- Exponential backoff: 1s, 2s, 4s, 8s
- Max retries: 3
- Circuit breaker: 5 failures in 60s = 30s cooldown
