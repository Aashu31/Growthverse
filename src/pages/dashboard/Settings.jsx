import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, KeyRound, Laptop, LogOut, Moon, ShieldCheck, Sun, Trash2 } from "lucide-react";
import { Button } from "../../components/common/Button";
import { FormInput } from "../../components/common/Forms";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ApiError } from "../../api/client";
import { formatDate } from "../../utils/formatters";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { changePassword, listSessions, revokeSession, logoutAll, logout } = useAuth();
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordState, setPasswordState] = useState({ submitting: false, message: "", error: "" });
  const [sessions, setSessions] = useState([]);
  const [sessionState, setSessionState] = useState({ loading: true, error: "" });
  const [revokingId, setRevokingId] = useState(null);

  const loadSessions = useCallback(async () => {
    setSessionState({ loading: true, error: "" });
    try {
      const list = await listSessions();
      setSessions(list);
      setSessionState({ loading: false, error: "" });
    } catch (error) {
      setSessionState({
        loading: false,
        error: error instanceof ApiError ? error.message : "Unable to load sessions.",
      });
    }
  }, [listSessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordState({ submitting: false, message: "", error: "New passwords do not match." });
      return;
    }
    setPasswordState({ submitting: true, message: "", error: "" });
    try {
      const response = await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordState({
        submitting: false,
        message: response?.message || "Password changed. Other sessions were signed out.",
        error: "",
      });
      loadSessions();
    } catch (error) {
      setPasswordState({
        submitting: false,
        message: "",
        error: error instanceof ApiError ? error.message : "Unable to change the password.",
      });
    }
  };

  const handleRevoke = async (session) => {
    setRevokingId(session.id);
    try {
      await revokeSession(session.id);
      if (session.current) {
        await logout();
        return;
      }
      await loadSessions();
    } catch (error) {
      setSessionState((previous) => ({
        ...previous,
        error: error instanceof ApiError ? error.message : "Unable to revoke the session.",
      }));
    } finally {
      setRevokingId(null);
    }
  };

  const handleLogoutAll = async () => {
    await logoutAll();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-h2 text-primary-text dark:text-white">Settings</h2>
        <p className="text-secondary-text dark:text-gray-300 mt-1">
          Manage dashboard preferences and account security.
        </p>
      </div>

      <div className="card-premium p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-text dark:text-white">Appearance</h3>
            <p className="text-sm text-secondary-text dark:text-gray-400 mt-1">
              Switch between light and dark mode. This preference is stored only on this device.
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 relative transition-colors duration-300 shrink-0"
            aria-label="Toggle dark mode"
            aria-pressed={theme === "dark"}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform duration-300 shadow-md flex items-center justify-center ${
                theme === "dark" ? "translate-x-8" : "translate-x-1"
              }`}
            >
              {theme === "dark" ? <Moon className="h-3 w-3 text-gray-700" /> : <Sun className="h-3 w-3 text-amber-500" />}
            </span>
          </button>
        </div>
      </div>

      <div className="card-premium p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-forest-light dark:bg-forest/20 text-forest-dark dark:text-forest-light flex items-center justify-center">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-text dark:text-white">Change password</h3>
            <p className="text-sm text-secondary-text dark:text-gray-400">
              All other sessions are revoked when the password changes.
            </p>
          </div>
        </div>

        {passwordState.message && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-300">
            <CheckCircle2 className="h-4 w-4 mt-0.5" /> {passwordState.message}
          </div>
        )}
        {passwordState.error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle className="h-4 w-4 mt-0.5" /> {passwordState.error}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="grid md:grid-cols-3 gap-4" noValidate>
          <FormInput
            label="Current password"
            type="password"
            name="currentPassword"
            id="settings-current-password"
            value={passwords.currentPassword}
            onChange={(event) => setPasswords((previous) => ({ ...previous, currentPassword: event.target.value }))}
            autoComplete="current-password"
            required
          />
          <FormInput
            label="New password"
            type="password"
            name="newPassword"
            id="settings-new-password"
            value={passwords.newPassword}
            onChange={(event) => setPasswords((previous) => ({ ...previous, newPassword: event.target.value }))}
            autoComplete="new-password"
            required
          />
          <FormInput
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            id="settings-confirm-password"
            value={passwords.confirmPassword}
            onChange={(event) => setPasswords((previous) => ({ ...previous, confirmPassword: event.target.value }))}
            autoComplete="new-password"
            required
          />
          <div className="md:col-span-3">
            <Button type="submit" variant="primary" loading={passwordState.submitting}>
              Update password
            </Button>
          </div>
        </form>
      </div>

      <div className="card-premium p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-text dark:text-white">Active sessions</h3>
              <p className="text-sm text-secondary-text dark:text-gray-400">
                Devices currently signed in to your account.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadSessions} disabled={sessionState.loading}>
              Refresh
            </Button>
            <Button variant="danger" size="sm" onClick={handleLogoutAll}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out all
            </Button>
          </div>
        </div>

        {sessionState.error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
            {sessionState.error}
          </div>
        )}

        {sessionState.loading ? (
          <p className="text-sm text-secondary-text dark:text-gray-400">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-secondary-text dark:text-gray-400">No active sessions found.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border dark:border-gray-700 p-4"
              >
                <div className="flex items-start gap-3">
                  <Laptop className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary-text dark:text-white">
                      {session.userAgent || "Unknown device"}
                      {session.current && (
                        <span className="ml-2 text-xs font-medium text-green-700 dark:text-green-400">This device</span>
                      )}
                    </p>
                    <p className="text-xs text-secondary-text dark:text-gray-400">
                      IP {session.ipAddress || "unknown"} · started {formatDate(session.createdAt)} · expires{" "}
                      {formatDate(session.expiresAt)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevoke(session)}
                  loading={revokingId === session.id}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Revoke
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card-premium p-6 md:p-8">
        <h3 className="text-lg font-semibold text-primary-text dark:text-white mb-2">Account</h3>
        <p className="text-sm text-secondary-text dark:text-gray-400 mb-4">
          Update your personal profile or review your customer account details.
        </p>
        <Link to="/account" className="btn-primary inline-flex px-5 py-2.5">Open my account</Link>
      </div>
    </div>
  );
}
