# Agent Object Model audit

address: http://127.0.0.1:3620
cli: node /Users/sumeetdebnath/Workspace/agent-om/packages/audit/bin/agent-om-audit.mjs

## Accounts

- An admin: sign in at /login as `admin`, password in $UMAMI_ADMIN_PASSWORD (kept in `agent-om/.env`).

## Scope

Every page a signed-in admin can reach. The app runs as a production build with
seeded data (a container on port 3620), started by whoever runs the audit, so
there is no `start:` line; the app's own dev server is `pnpm dev` (`dotenv next
dev`), on port 3000.
