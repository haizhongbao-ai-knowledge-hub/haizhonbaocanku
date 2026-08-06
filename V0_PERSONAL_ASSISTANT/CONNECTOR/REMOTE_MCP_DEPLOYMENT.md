# Remote MCP Deployment

Primary target: Render web service.

## Runtime

- Node.js 18+
- HTTPS via platform
- Auth via `Authorization: Bearer <token>`
- Identity via `X-V0-Identity`

## Required env vars

- `V0_MCP_BEARER_TOKEN`
- `V0_MCP_BIND_HOST`
- `V0_MCP_PORT`
- `V0_MCP_PROTOCOL_VERSION`
- `V0_MCP_ALLOWED_ORIGINS`
- `V0_RATE_LIMIT_WINDOW_MS`
- `V0_RATE_LIMIT_MAX`
- `V0_MCP_LOG_DIR`
- `V0_REPO_ROOT`
- `V0_REPO_BRANCH`
- `V0_GITHUB_REPO`
- `V0_GITHUB_BRANCH`
- `V0_GITHUB_TOKEN`
- `V0_REPO_REFRESH_ON_START`

## Endpoints

- `GET /healthz`
- `GET /version`
- `GET /mcp`
- `POST /mcp`

## Start

```powershell
npm start
```

## Update

- Push to GitHub
- Let the platform auto-deploy

## Logs

- Platform logs for HTTP/runtime
- `runtime/mcp_logs/*.log` for read trace and request trace

## Rollback

- Revert the Git commit
- Redeploy the previous revision
