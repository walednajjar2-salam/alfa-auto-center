const { spawnSync } = require("node:child_process");

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres://")) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace("postgres://", "postgresql://");
}
if (process.env.DATABASE_URL && !/[?&]sslmode=/.test(process.env.DATABASE_URL) && /railway|rlwy|proxy/.test(process.env.DATABASE_URL)) {
  process.env.DATABASE_URL += (process.env.DATABASE_URL.includes("?") ? "&" : "?") + "sslmode=require";
}

process.env.AUTH_TRUST_HOST = process.env.AUTH_TRUST_HOST || "true";
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET =
    process.env.NEXTAUTH_SECRET ||
    process.env.RAILWAY_PROJECT_ID ||
    "AlfaAutoCenterChangeMe";
  console.warn("AUTH_SECRET was missing; using a temporary fallback. Set AUTH_SECRET in Railway.");
}

if (process.env.DATABASE_URL) {
  const push = spawnSync("npx", ["prisma", "db", "push", "--skip-generate"], {
    stdio: "inherit",
    env: process.env,
  });
  if (push.status) {
    console.warn("prisma db push failed; starting the app anyway so /login can come up.");
  }
} else {
  console.warn("DATABASE_URL is missing. Link PostgreSQL on Railway. Starting without DB push.");
}

const port = process.env.PORT || "3000";
const start = spawnSync("npx", ["next", "start", "-H", "0.0.0.0", "-p", port], {
  stdio: "inherit",
  env: process.env,
});
process.exit(start.status || 0);
