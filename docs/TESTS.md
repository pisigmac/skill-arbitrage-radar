# Testing Strategy

## Unit Tests (Vitest)
Run: `npm run test`

### Router Tests
- `arbitrage-router.test.ts` - Score calculation, recommendation generation
- `profile-router.test.ts` - CRUD operations
- `execution-router.test.ts` - Status transitions
- `income-router.test.ts` - Summary calculations

### Component Tests
- Page rendering
- Form validation
- Button interactions

## Integration Tests
- Database operations with test container
- tRPC router integration
- Auth flow

## E2E Tests (Playwright)
- User signup -> profile creation -> arbitrage discovery
- Task creation -> status update -> completion
- Income logging -> summary verification

## Load Tests (k6)
- Target: 1000 concurrent users
- p95 latency < 200ms
- 99.9% uptime

## CI
All tests run on every PR. Coverage threshold: 80%.
