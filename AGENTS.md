# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Single-service NestJS backend (in `backend/`). No database, no Docker, no frontend — all data is in-memory and resets on server restart.

### Commands

All commands run from the `backend/` directory. See `backend/package.json` `scripts` for the full list.

| Task | Command |
|---|---|
| Install deps | `npm install` |
| Dev server | `npm run start:dev` (port 3000) |
| Lint | `npm run lint` |
| Unit tests | `npm run test` |
| E2E tests | `npm run test:e2e` |
| Build | `npm run build` |

### Seed data

A default admin account is created on startup: `admin@raffle.app` / `Admin1234!` (roles: admin, user).

### Gotchas

- The JWT response field is `accessToken` (camelCase), not `access_token`.
- Raffle creation requires `totalTickets`, `prizeValueApprox`, `drawDateTime`, `lotteryDate`, `rulePattern`, and `termsAndConditions` (min 10 chars). See `CreateRaffleDto` for the full schema.
- Ticket reservation uses `quantity` (integer), not `numbers` or `paymentMethod`. See `CreateTicketReservationDto`.
- Node.js v22 is required (matches `engines` / lockfile expectations). The environment ships with v22.22.1 via nvm.
- No external services are needed — no database, no Redis, no Docker.
