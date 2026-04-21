"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { UserRole } from "@prisma/client";
import AdminMetricStrip from "@/components/admin/AdminMetricStrip";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";

const roles: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.PROGRAM_MANAGER,
  UserRole.AUDITOR,
  UserRole.JUDGE,
  UserRole.ENTRANT,
];

type UserRow = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
};

export default function AdminCreateUserPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.AUDITOR);
  const [editName, setEditName] = useState<Record<string, string>>({});
  const [editRole, setEditRole] = useState<Record<string, UserRole>>({});
  const [editPassword, setEditPassword] = useState<Record<string, string>>({});
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const counts = useMemo(() => {
    const base: Record<string, number> = { ALL: users.length };
    for (const r of roles) base[r] = users.filter((u) => u.role === r).length;
    return base;
  }, [users]);

  async function loadUsers() {
    setLoadingUsers(true);
    setError(null);
    const query = roleFilter === "ALL" ? "" : `?role=${roleFilter}`;
    const res = await fetch(`/api/users/${query}`, { cache: "no-store" });
    const body = await res.json().catch(() => ({}));
    setLoadingUsers(false);
    if (!res.ok) {
      setError(body.error ?? "Could not load users");
      return;
    }
    const rows = (body.users ?? []) as UserRow[];
    setUsers(rows);
    setEditName(
      Object.fromEntries(rows.map((u) => [u.id, u.fullName])),
    );
    setEditRole(
      Object.fromEntries(rows.map((u) => [u.id, u.role])),
    );
    setEditPassword({});
  }

  useEffect(() => {
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName, role }),
    });
    setLoading(false);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Could not create user");
      return;
    }
    setMessage(`Created ${body.user?.email} (${body.user?.role})`);
    setEmail("");
    setPassword("");
    setFullName("");
    await loadUsers();
  }

  async function saveUser(user: UserRow) {
    setError(null);
    setMessage(null);
    const payload: {
      userId: string;
      fullName?: string;
      role?: UserRole;
      resetPassword?: string;
    } = { userId: user.id };

    const nextName = (editName[user.id] ?? "").trim();
    const nextRole = editRole[user.id] ?? user.role;
    const nextPassword = (editPassword[user.id] ?? "").trim();
    if (nextName && nextName !== user.fullName) payload.fullName = nextName;
    if (nextRole !== user.role) payload.role = nextRole;
    if (nextPassword) payload.resetPassword = nextPassword;
    if (Object.keys(payload).length === 1) {
      setError("No changes for this user.");
      return;
    }

    const res = await fetch("/api/users/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Could not update user");
      return;
    }
    setMessage(`Updated ${body.user?.email}`);
    setEditPassword((prev) => ({ ...prev, [user.id]: "" }));
    await loadUsers();
  }

  async function impersonateUser(user: UserRow) {
    setImpersonatingId(user.id);
    setError(null);
    const res = await fetch("/api/auth/impersonate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const body = await res.json().catch(() => ({}));
    setImpersonatingId(null);
    if (!res.ok) {
      setError(body.error ?? "Could not impersonate user");
      return;
    }
    window.location.href = body.redirectTo || "/admin/";
  }

  const userMetrics = useMemo(
    () => [
      { label: "Directory total", value: counts.ALL ?? 0 },
      {
        label: "Staff accounts",
        value: Math.max(0, (counts.ALL ?? 0) - (counts.ENTRANT ?? 0)),
      },
      { label: "Entrants", value: counts.ENTRANT ?? 0 },
    ],
    [counts],
  );

  return (
    <main className="admin-page--wide">
      <AdminPageHeader
        eyebrow="Accounts"
        title="User management and impersonation"
        description="Super admin only. Create, update, reset passwords, and impersonate any role account in one click."
      />
      <AdminMetricStrip items={userMetrics} />
      <AdminSection title="Directory">
        <div className="admin-chip-row">
          <button type="button" className={roleFilter === "ALL" ? "is-active" : undefined} onClick={() => setRoleFilter("ALL")}>
            All ({counts.ALL ?? 0})
          </button>
          {roles.map((r) => (
            <button key={r} type="button" className={roleFilter === r ? "is-active" : undefined} onClick={() => setRoleFilter(r)}>
              {r} ({counts[r] ?? 0})
            </button>
          ))}
        </div>
        <div className="admin-inline-actions">
          <button type="button" onClick={() => void loadUsers()} disabled={loadingUsers}>
            {loadingUsers ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Temp password reset</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>
                    <input
                      value={editName[user.id] ?? ""}
                      onChange={(e) => setEditName((prev) => ({ ...prev, [user.id]: e.target.value }))}
                    />
                  </td>
                  <td>
                    <select
                      value={editRole[user.id] ?? user.role}
                      onChange={(e) => setEditRole((prev) => ({ ...prev, [user.id]: e.target.value as UserRole }))}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="password"
                      minLength={10}
                      placeholder="Optional new password"
                      value={editPassword[user.id] ?? ""}
                      onChange={(e) => setEditPassword((prev) => ({ ...prev, [user.id]: e.target.value }))}
                    />
                  </td>
                  <td>
                    <div className="admin-inline-actions admin-actions-row--tight">
                      <button type="button" onClick={() => void saveUser(user)}>
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => void impersonateUser(user)}
                        disabled={impersonatingId === user.id}
                      >
                        {impersonatingId === user.id ? "Switching…" : "Impersonate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5}>No users found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </AdminSection>
      <AdminSection title="Create account">
        <form onSubmit={onSubmit} className="admin-form">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Full name
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>
        <label>
          Temporary password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={10} required />
        </label>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-ok">{message}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create user"}
        </button>
        </form>
      </AdminSection>
    </main>
  );
}
