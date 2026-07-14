# Database Schema

## Tables

### users
Kimi OAuth users. Fields: id, unionId, name, email, avatar, role, subscriptionTier, timestamps.

### user_profiles
User skill profiles. Fields: id, user_id, skills (JSON), experience_level, time_available_hours_per_week, constraints (JSON), target_income_monthly.

### skills
Canonical skill graph. Fields: id, name, category, parent_skill_id, demand_score, supply_score, avg_hourly_rate_usd, job_count_30d.

### skill_combinations
Arbitrage opportunities. Fields: id, skill_ids (JSON), combination_name, demand_score, supply_score, arbitrage_score, avg_hourly_rate_usd, job_count_30d, freelancer_count_30d, price_range_low, price_range_high, trend_direction, data_sources (JSON).

### job_postings
Scraped jobs. Fields: id, external_id, source, title, description, skills (JSON), budget_min/max, budget_type, location, remote, posted_at, url, raw_data (JSON).

### recommendations
Per-user recommendations. Fields: id, user_id, skill_combination_id, rank, match_score, projected_monthly_income, time_to_first_income_days, rationale, is_saved, is_dismissed.

### portfolio_projects
Portfolio specs. Fields: id, skill_combination_id, title, description, tech_stack (JSON), acceptance_criteria (JSON), estimated_hours, difficulty, asset_url, github_template_url.

### outreach_templates
Outreach copy. Fields: id, skill_combination_id, channel, template_body, subject_line, open_rate, response_rate, variant_name.

### execution_tasks
Kanban tasks. Fields: id, user_id, recommendation_id, title, description, status, priority, due_date, completed_at.

### income_logs
Income entries. Fields: id, user_id, recommendation_id, amount, currency, source, hours_worked, logged_at.

### scraping_logs
Scraper runs. Fields: id, source, status, items_scraped, items_inserted, error_message, started_at, completed_at.

## Indexes
- skill_combinations: arbitrage_score (DESC), trend_direction
- recommendations: user_id, is_saved
- job_postings: source, scraped_at
- execution_tasks: user_id + status
- income_logs: user_id
- scraping_logs: source
