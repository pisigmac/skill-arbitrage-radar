# Analytics Plan

## Events to Track

| Event | Trigger | Properties |
|-------|---------|------------|
| profile_created | After profile upsert | skills_count, experience_level |
| arbitrage_viewed | Dashboard load | count_shown |
| opportunity_saved | Save button click | combination_id, score |
| opportunity_dismissed | Dismiss click | combination_id |
| portfolio_viewed | Tab click | combination_id |
| outreach_copied | Copy template | channel, variant |
| task_created | Add task | status, priority |
| task_completed | Status -> done | days_in_progress |
| income_logged | Save income | amount, source |
| recommendation_dismissed | Dismiss click | combination_id |

## Metrics
- DAU/MAU
- Arbitrage searches per user
- Saved opportunities per user
- Portfolio projects generated
- Income logged (verified)
- Scraper data freshness
- NPS (target: > 50)

## Privacy
- No PII in analytics
- GDPR-compliant opt-out
- Data retention: 90 days for events
