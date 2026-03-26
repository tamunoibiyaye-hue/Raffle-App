# Raffle-App

Initial MVP backend for a raffle platform where registered users can create raffles and both registered users and guests can buy tickets.

## Stack

- NestJS (Node.js / TypeScript)
- In-memory data store for MVP speed
- JWT authentication

## Project structure

- `backend/` - NestJS API

## Quick start

```bash
cd backend
npm install
npm run start:dev
```

API runs at `http://localhost:3000`.

## Seed admin account (MVP)

- Email: `admin@raffle.app`
- Password: `Admin1234!`

## Implemented MVP modules

- **Auth**
  - `POST /auth/register`
  - `POST /auth/login`
- **Users**
  - `GET /users/me`
  - `PUT /users/me`
- **Raffles**
  - `GET /raffles` (filters: `category`, `maxTicketPrice`, `drawDate`, `status`)
  - `GET /raffles/:id`
  - `POST /raffles`
  - `PUT /raffles/:id`
  - `PUT /raffles/:id/status`
- **Tickets**
  - `POST /raffles/:id/tickets`
  - `GET /users/me/tickets`
  - `GET /guest/tickets?email=...&phone=...&code=...`
- **Payments**
  - `POST /payments/charge`
  - `POST /payments/webhooks/:provider`
- **Lottery Results**
  - `POST /lottery-results` (admin)
  - `GET /lottery-results?date=...&lotteryType=...`
- **Draw execution**
  - `POST /raffles/:id/draw` (admin)
- **Admin / Backoffice**
  - `GET /admin/users`
  - `PUT /admin/users/:id/block`
  - `PUT /admin/users/:id/verify-organizer`
  - `GET /admin/raffles`
  - `GET /admin/transactions`
  - `GET /admin/reports/summary`
  - `GET /admin/notifications`

## Notes

- Card payments are simulated as immediate `paid`.
- Transfer/Yappy stay `pending` until webhook/manual update.
- Draw logic uses Panama lottery first prize and raffle rule (`last2`, `last3`, `last4`) against ticket number suffix.
- Data is in-memory and resets when the server restarts.

## Health and MVP info

- `GET /` -> API health
- `GET /docs/mvp` -> MVP module summary and seed credentials
