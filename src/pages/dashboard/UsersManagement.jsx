import React, { useMemo, useState } from "react";
import { AlertCircle, Search, ShieldCheck } from "lucide-react";
import { useData } from "../../context/DataContext";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { ApiError } from "../../api/client";
import { formatDate } from "../../utils/formatters";

const ROLES = ["SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"];
const STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"];

export default function UsersManagement() {
  const { users, updateUser, loading, errors, refreshResource } = useData();
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
    );
  }, [users, search]);

  const handleUpdate = async (user, changes) => {
    setBusyId(user.id);
    setActionError("");
    try {
      await updateUser(user.id, changes);
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "Unable to update the user.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 text-dark-text dark:text-light-text">Users & Roles</h2>
        <p className="text-warm-grey dark:text-dark-mocha/60 mt-1">
          Only super administrators can change roles or account status.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-sand-beige/30 bg-sand-beige/20 dark:bg-deep-coffee/10 p-4 text-sm text-caramel dark:text-light-gold">
        <ShieldCheck className="h-5 w-5 mt-0.5 shrink-0" />
        <span>
          You cannot demote or suspend the last active super administrator. Role changes revoke
          that user's sessions immediately.
        </span>
      </div>

      {actionError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}
      {errors.users && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
          {errors.users}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-grey" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search users by name, email or role..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gv-border dark:border-gv-border-dark bg-white dark:bg-deep-coffee text-dark-text dark:text-light-text focus:outline-none focus:ring-2 focus:ring-champagne/40"
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-deep-coffee rounded-2xl border border-gv-border dark:border-gv-border-dark">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gv-border dark:border-gv-border-dark bg-sand-beige/50 dark:bg-deep-coffee/50">
              <th className="px-4 py-3 font-medium text-warm-grey dark:text-dark-mocha/60">User</th>
              <th className="px-4 py-3 font-medium text-warm-grey dark:text-dark-mocha/60">Verified</th>
              <th className="px-4 py-3 font-medium text-warm-grey dark:text-dark-mocha/60">Role</th>
              <th className="px-4 py-3 font-medium text-warm-grey dark:text-dark-mocha/60">Status</th>
              <th className="px-4 py-3 font-medium text-warm-grey dark:text-dark-mocha/60">Last login</th>
            </tr>
          </thead>
          <tbody>
            {loading.users && filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-warm-grey dark:text-dark-mocha/60">Loading users...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-warm-grey dark:text-dark-mocha/60">No users found.</td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="border-b border-gv-border dark:border-gv-border-dark last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-dark-text dark:text-light-text">{user.name || "Unnamed user"}</p>
                    <p className="text-xs text-warm-grey dark:text-dark-mocha/60">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={user.emailVerified ? "verified" : "pending"} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={busyId === user.id}
                      onChange={(event) => handleUpdate(user, { role: event.target.value })}
                      className="px-3 py-2 rounded-lg border border-gv-border dark:border-gv-border-dark bg-white dark:bg-deep-coffee text-dark-text dark:text-light-text text-sm"
                      aria-label={`Role for ${user.email}`}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>{role.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.status}
                      disabled={busyId === user.id}
                      onChange={(event) => handleUpdate(user, { status: event.target.value })}
                      className="px-3 py-2 rounded-lg border border-gv-border dark:border-gv-border-dark bg-white dark:bg-deep-coffee text-dark-text dark:text-light-text text-sm"
                      aria-label={`Status for ${user.email}`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-warm-grey dark:text-dark-mocha/60">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => refreshResource("users")}
        className="text-sm text-caramel dark:text-light-gold font-medium hover:underline"
      >
        Refresh users
      </button>
    </div>
  );
}
