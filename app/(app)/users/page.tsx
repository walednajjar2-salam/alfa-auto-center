import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { roleLabel } from "@/lib/status";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default async function UsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <section className="dashboard-content">
      <PageHeader title="المستخدمون" actionHref="/users/new" actionLabel="مستخدم جديد" />
      {users.length === 0 ? (
        <EmptyState title="لا مستخدمين" />
      ) : (
        <div className="card-list">
          {users.map((u) => (
            <Link key={u.id} href={`/users/${u.id}`} className="list-card">
              <div>
                <strong>{u.name}</strong>
                <small>
                  {u.username} · {roleLabel[u.role]}
                </small>
              </div>
              <span className={u.isActive ? "ok-text" : "form-error"}>{u.isActive ? "نشط" : "موقوف"}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
