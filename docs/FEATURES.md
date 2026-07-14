# Feature Specification

## F1 - Skill Arbitrage Engine
- [x] Input: User's skills, experience level, time availability
- [x] Output: Ranked arbitrage opportunities with scores
- [x] Each includes: demand score, supply score, arbitrage score, price ranges, job count
- [x] Personalized recommendations with match scores
- [x] LLM-generated rationale for each recommendation

## F2 - Live Market Data
- [x] Scraper status dashboard
- [x] Mock seed data for 10 skill combinations
- [x] Job posting storage with external IDs
- [x] Data normalization pipeline
- [ ] Actual scraper implementation (Playwright/Scrapy)
- [ ] Proxy rotation
- [ ] Rate limiting

## F3 - Portfolio Project Generator
- [x] Portfolio templates for top combinations
- [x] Tech stack, acceptance criteria, estimated hours
- [x] Dynamic fallback generation
- [ ] PDF generation
- [ ] GitHub repo scaffolding

## F4 - Client Outreach System
- [x] Email templates per niche
- [x] LinkedIn DM templates
- [x] A/B variant tracking
- [x] Upwork proposal templates
- [ ] Actual email sending (Resend)
- [ ] Open/response rate analytics

## F5 - Execution Kanban
- [x] Full CRUD for tasks
- [x] Status transitions (backlog -> in_progress -> done)
- [x] Priority levels
- [x] Default task initialization
- [ ] Drag-and-drop
- [ ] Notion/Trello export

## F6 - Income Tracker
- [x] Income logging with source and hours
- [x] Monthly breakdown charts
- [x] Summary stats (total, avg rate, hours)
- [x] Delete functionality
- [ ] Projected vs actual comparison
- [ ] Arbitrage heating/cooling report

## Auth
- [x] Kimi OAuth integration
- [x] Role-based access (user/admin)
- [x] Protected routes

## Admin
- [x] Admin-only scraper trigger
- [x] Scraping logs viewer
