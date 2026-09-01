const { spawnSync } = require("node:child_process");

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres://")) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace("postgres://", "postgresql://");
}

process.env.AUTH_TRUST_HOST = process.env.AUTH_TRUST_HOST || "true";
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET =
    process.env.NEXTAUTH_SECRET ||
    process.env.RAILWAY_PROJECT_ID ||
    "AlfaAutoCenterChangeMe";
  console.warn("AUTH_SECRET was missing; using a temporary fallback. Set AUTH_SECRET in Railway.");
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Link a PostgreSQL service to this Railway app.");
  process.exit(1);
}

const push = spawnSync("npx", ["prisma", "db", "push", "--skip-generate"], {
  stdio: "inherit",
  env: process.env,
});
if (push.status) process.exit(push.status);

const port = process.env.PORT || "3000";
const start = spawnSync("npx", ["next", "start", "-H", "0.0.0.0", "-p", port], {
  stdio: "inherit",
  env: process.env,
});
process.exit(start.status || 0);
