# Environment Variables

## Required

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `mysql://user:pass@host:3306/db` | MySQL connection |
| `VITE_APP_ID` | `app-id-from-kimi` | Kimi OAuth app ID |
| `APP_SECRET` | `secret-from-kimi` | Server app secret |

## Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `MINIO_ENDPOINT` | `localhost:9000` | MinIO endpoint |
| `MINIO_ACCESS_KEY` | `minioadmin` | MinIO access key |
| `MINIO_SECRET_KEY` | `minioadmin` | MinIO secret key |
| `OPENAI_API_KEY` | - | OpenAI API key |
| `ANTHROPIC_API_KEY` | - | Anthropic API key |

## Secrets Management
- Development: `.env` file (gitignored)
- Staging: Docker secrets
- Production: K8s secrets or Vault
