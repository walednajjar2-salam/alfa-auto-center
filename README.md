# ALFA Auto Center

نظام إدارة عربي للجوال لمركز ألفا لصيانة السيارات.

## Stack
- Next.js 15 + TypeScript
- Prisma + PostgreSQL
- Auth.js (credentials)
- Mobile-first RTL UI
- Railway-ready

## What works now
- تسجيل دخول حقيقي (المستخدم الافتراضي `admin` / `Alfa@2026`)
- لوحة تحكم بأرقام من قاعدة البيانات
- العملاء والسيارات (إضافة، تعديل، بحث)
- استقبال سيارة وإنشاء أمر عمل
- دورة أمر العمل: استلام → فحص → موافقة → صيانة → جاهزة → تسليم
- بنود أجور وقطع
- إصدار فاتورة من أمر العمل وتسجيل الدفعات

## Local
```bash
cp .env.example .env
# set DATABASE_URL, AUTH_SECRET, ADMIN_PASSWORD
npx prisma db push
SEED_DEMO=true npx prisma db seed
npm run dev
```

## Railway
1. Create PostgreSQL and link it so `DATABASE_URL` is injected.
2. Set `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, and `ADMIN_PASSWORD`.
3. Optional: `SEED_DEMO=true` then run `npx prisma db seed` once.
4. Build: `npm run build`
5. Start: `npm run start`
6. Pre-deploy already runs `npx prisma db push`.
