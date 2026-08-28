# ALFA Auto Center

Mobile-first Arabic management system for مركز ألفا لصيانة السيارات.

## Stack
- Next.js 15 + TypeScript
- Prisma + PostgreSQL
- NextAuth/Auth.js ready
- Mobile-first RTL UI
- Railway-ready

## Current phase
- Login screen
- Mobile dashboard
- Expandable mobile navigation drawer
- Initial Prisma schema for users, customers, vehicles, work orders

## Railway
1. Create PostgreSQL service in Railway.
2. Add `DATABASE_URL` and `AUTH_SECRET` environment variables.
3. Deploy this GitHub repository as a Railway service.
4. Build command: `npm run build`
5. Start command: `npm run start`

## Next phase
Authentication, customer CRUD, vehicle CRUD, vehicle reception, work order flow, inspection, invoice and payments.
