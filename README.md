# ALFA Auto Center

نظام إدارة عربي للجوال لمركز ألفا لصيانة السيارات.

## Stack
- Next.js 15 + TypeScript
- Prisma + PostgreSQL
- Auth.js (credentials)
- Mobile-first RTL UI
- Railway-ready

## الوحدات
- دخول وصلاحيات مستخدمين
- لوحة تحكم وتنبيهات (مواعيد، نواقص مخزون)
- العملاء، السيارات، سجل الزيارات
- استقبال، أوامر عمل، فحص، صيانة، تسليم
- مخزون: قطع، موردون، مشتريات مع زيادة الكمية
- فواتير، دفعات، مصاريف، صندوق
- مواعيد، تقارير، إعدادات المركز والضريبة

## Local
```bash
cp .env.example .env
npx prisma db push
SEED_DEMO=true npx prisma db seed
npm run dev
```

الدخول الافتراضي: `admin` / `Alfa@2026`

## Railway
1. اربط PostgreSQL ليُحقن `DATABASE_URL`.
2. عيّن `AUTH_SECRET` و`AUTH_TRUST_HOST=true` و`ADMIN_PASSWORD`.
3. اختياري: `SEED_DEMO=true` ثم `npx prisma db seed` مرة واحدة.
4. البناء: `npm run build` — التشغيل: `npm run start`
