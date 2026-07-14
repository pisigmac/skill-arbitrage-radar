# API Documentation

## Authentication
All endpoints except `ping`, `arbitrage.list`, `arbitrage.getById`, `portfolio.getByCombination`, `outreach.getByCombination` require authentication via Kimi OAuth.

## Endpoints

### auth
- `auth.me` - Get current user
- `auth.logout` - Clear session

### profile
- `profile.get` - Get user's skill profile
- `profile.upsert` - Create/update profile (skills, experience, time, income target)

### arbitrage
- `arbitrage.list` - List opportunities (limit, minArbitrageScore)
- `arbitrage.getById` - Single opportunity with skills + jobs
- `arbitrage.recommend` - Personalized recommendations for user
- `arbitrage.save` / `arbitrage.dismiss` - Manage recommendations
- `arbitrage.saved` - Get saved recommendations

### portfolio
- `portfolio.getByCombination` - Get portfolio project for a skill combo
- `portfolio.generate` - Generate new portfolio project

### outreach
- `outreach.getByCombination` - Get templates for a skill combo
- `outreach.trackOpen` / `trackResponse` - Analytics tracking

### execution
- `execution.list` - Get all tasks for user
- `execution.create` - Create task (title, description, priority)
- `execution.updateStatus` - Move task between statuses
- `execution.delete` - Remove task
- `execution.initDefaults` - Pre-populate default tasks

### income
- `income.list` - Get income logs
- `income.create` - Log income (amount, source, hours)
- `income.summary` - Aggregated stats + monthly breakdown
- `income.delete` - Remove log

### scraper
- `scraper.status` - Health dashboard for all sources
- `scraper.trigger` - Admin: trigger scraper run
- `scraper.logs` - Admin: view scraping logs
