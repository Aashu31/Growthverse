import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Laptop,
  LogOut,
  Mail,
  MailWarning,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../api/client";
import { customersApi, ordersApi } from "../../api/resources.api";
import { FormInput } from "../../components/common/Forms";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { formatDate } from "../../utils/formatters";
import { isStaffRole, roleLabel } from "../../utils/permissions";

function Section({ title, description, icon: Icon, children, action }) {
  return (
    <section className="bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-forest-light dark:bg-forest/20 text-forest-dark dark:text-forest-light flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-primary-text dark:text-white">{title}</h2>
            {description && <p className="text-sm text-secondary-text dark:text-gray-400">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function Account() {
  const {
    user,
    updateProfile,
    changePassword,
    listSessions,
    revokeSession,
    logout,
    logoutAll,
    resendVerification,
  } = useAuth();

  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [profileState, setProfileState] = useState({ saving: false, message: "", error: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordState, setPasswordState] = useState({ saving: false, message: "", error: "" });
  const [sessions, setSessions] = useState([]);
  const [sessionState, setSessionState] = useState({ loading: true, error: "" });
  const [revokingId, setRevokingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersState, setOrdersState] = useState({ loading: true, error: "" });
  const [customer, setCustomer] = useState(null);
  const [verifyState, setVerifyState] = useState({ sending: false, message: "", error: "" });

  const isStaff = isStaffRole(user?.role);

  useEffect(() => {
    setProfile({ name: user?.name || "", phone: user?.phone || "" });
  }, [user?.name, user?.phone]);

  const loadSessions = useCallback(async () => {
    setSessionState({ loading: true, error: "" });
    try {
      setSessions(await listSessions());
      setSessionState({ loading: false, error: "" });
    } catch (error) {
      setSessionState({
        loading: false,
        error: error instanceof ApiError ? error.message : "Unable to load sessions.",
      });
    }
  }, [listSessions]);

  const loadOrders = useCallback(async () => {
    setOrdersState({ loading: true, error: "" });
    try {
      const response = await ordersApi.list();
      setOrders(response?.data?.orders || []);
      setOrdersState({ loading: false, error: "" });
    } catch (error) {
      setOrdersState({
        loading: false,
        error: error instanceof ApiError ? error.message : "Unable to load orders.",
      });
    }
  }, []);

  useEffect(() => {
    loadSessions();
    if (!isStaff) loadOrders();
    if (user?.role === "CUSTOMER") {
      customersApi
        .me()
        .then((response) => setCustomer(response?.data?.customer || null))
        .catch(() => setCustomer(null));
    }
  }, [isStaff, loadOrders, loadSessions, user?.role]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileState({ saving: true, message: "", error: "" });
    try {
      await updateProfile({ name: profile.name.trim(), phone: profile.phone.trim() });
      setProfileState({ saving: false, message: "Profile updated.", error: "" });
    } catch (error) {
      setProfileState({
        saving: false,
        message: "",
        error: error instanceof ApiError ? error.message : "Unable to update your profile.",
      });
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      setPasswordState({ saving: false, message: "", error: "New passwords do not match." });
      return;
    }
    setPasswordState({ saving: true, message: "", error: "" });
    try {
      const response = await changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordState({
        saving: false,
        message: response?.message || "Password changed.",
        error: "",
      });
      loadSessions();
    } catch (error) {
      setPasswordState({
        saving: false,
        message: "",
        error: error instanceof ApiError ? error.message : "Unable to change your password.",
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

  const handleResendVerification = async () => {
    setVerifyState({ sending: true, message: "", error: "" });
    try {
      const response = await resendVerification({ email: user.email });
      setVerifyState({
        sending: false,
        message:
          response?.devVerificationUrl ||
          response?.message ||
          "If verification is required, a new email has been sent.",
        error: "",
      });
    } catch (error) {
      setVerifyState({
        sending: false,
        message: "",
        error: error instanceof ApiError ? error.message : "Unable to resend verification.",
      });
    }
  };

  return (
    <div className="container-premium py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal dark:text-white font-display">My account</h1>
          <p className="text-muted dark:text-gray-400 mt-1">
            {user?.name} · {user?.email} · {roleLabel(user?.role)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isStaff && (
            <Link to="/dashboard" className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-2">
              Open dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-border dark:border-gray-700 text-sm font-medium text-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 inline-flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {!user?.emailVerified && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/20">
          <div className="flex items-start gap-3">
            <MailWarning className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Your email is not verified</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Verify your email to secure your account and receive important updates.
              </p>
              {verifyState.message && (
                <p className="text-xs text-amber-800 dark:text-amber-200 mt-2 break-all">{verifyState.message}</p>
              )}
              {verifyState.error && (
                <p className="text-xs text-red-700 dark:text-red-300 mt-2">{verifyState.error}</p>
              )}
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={verifyState.sending}
                className="mt-2 text-sm font-medium text-amber-900 dark:text-amber-100 underline disabled:opacity-60"
              >
                {verifyState.sending ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Profile" description="Your personal contact details." icon={User}>
          {profileState.message && (
            <p className="mb-4 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" /> {profileState.message}
            </p>
          )}
          {profileState.error && (
            <p className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" /> {profileState.error}
            </p>
          )}
          <form onSubmit={handleProfileSubmit} className="space-y-4" noValidate>
            <FormInput
              label="Full name"
              name="name"
              id="account-name"
              value={profile.name}
              onChange={(event) => setProfile((previous) => ({ ...previous, name: event.target.value }))}
              required
            />
            <FormInput
              label="Phone"
              name="phone"
              id="account-phone"
              value={profile.phone}
              onChange={(event) => setProfile((previous) => ({ ...previous, phone: event.target.value }))}
              placeholder="Optional"
            />
            <div>
              <label className="block text-sm font-medium text-primary-text dark:text-white mb-1">Email</label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 text-sm text-secondary-text dark:text-gray-300">
                <Mail className="h-4 w-4 text-gray-400" /> {user?.email}
              </div>
              <p className="text-xs text-muted dark:text-gray-500 mt-1">
                Contact support to change the email on your account.
              </p>
            </div>
            <Button type="submit" variant="primary" loading={profileState.saving}>
              Save profile
            </Button>
          </form>
        </Section>

        <Section title="Password" description="Changing your password signs out other devices." icon={KeyRound}>
          {passwordState.message && (
            <p className="mb-4 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" /> {passwordState.message}
            </p>
          )}
          {passwordState.error && (
            <p className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" /> {passwordState.error}
            </p>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
            <FormInput
              label="Current password"
              type="password"
              name="currentPassword"
              id="account-current-password"
              value={password.currentPassword}
              onChange={(event) => setPassword((previous) => ({ ...previous, currentPassword: event.target.value }))}
              autoComplete="current-password"
              required
            />
            <FormInput
              label="New password"
              type="password"
              name="newPassword"
              id="account-new-password"
              value={password.newPassword}
              onChange={(event) => setPassword((previous) => ({ ...previous, newPassword: event.target.value }))}
              autoComplete="new-password"
              required
            />
            <FormInput
              label="Confirm new password"
              type="password"
              name="confirmPassword"
              id="account-confirm-password"
              value={password.confirmPassword}
              onChange={(event) => setPassword((previous) => ({ ...previous, confirmPassword: event.target.value }))}
              autoComplete="new-password"
              required
            />
            <Button type="submit" variant="primary" loading={passwordState.saving}>
              Update password
            </Button>
          </form>
        </Section>
      </div>

      {customer && (
        <Section title="Customer record" description="Linked to your account by the GrowthVerse team." icon={ShieldCheck}>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-secondary-text dark:text-gray-400">Company</dt>
              <dd className="text-primary-text dark:text-white font-medium">{customer.company || "Not set"}</dd>
            </div>
            <div>
              <dt className="text-secondary-text dark:text-gray-400">Phone</dt>
              <dd className="text-primary-text dark:text-white font-medium">{customer.phone || "Not set"}</dd>
            </div>
            <div>
              <dt className="text-secondary-text dark:text-gray-400">Country</dt>
              <dd className="text-primary-text dark:text-white font-medium">{customer.country || "Not set"}</dd>
            </div>
            <div>
              <dt className="text-secondary-text dark:text-gray-400">Status</dt>
              <dd><StatusBadge value={customer.status} /></dd>
            </div>
          </dl>
        </Section>
      )}

      {!isStaff && (
        <Section
          title="My orders"
          description="Orders linked to your customer record."
          icon={ShoppingBag}
          action={
            <Button variant="outline" size="sm" onClick={loadOrders} disabled={ordersState.loading}>
              Refresh
            </Button>
          }
        >
          {ordersState.error && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">{ordersState.error}</p>
          )}
          {ordersState.loading ? (
            <p className="text-sm text-secondary-text dark:text-gray-400">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-secondary-text dark:text-gray-400">You have no orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border dark:border-gray-700 text-secondary-text dark:text-gray-400">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border dark:border-gray-700 last:border-0">
                      <td className="py-3 font-medium text-primary-text dark:text-white">{order.orderNumber}</td>
                      <td className="py-3 text-secondary-text dark:text-gray-300">{order.projectTitle}</td>
                      <td className="py-3 text-primary-text dark:text-white">
                        {order.currency || "INR"} {Number(order.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 text-secondary-text dark:text-gray-400">{formatDate(order.createdAt)}</td>
                      <td className="py-3"><StatusBadge value={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      <Section
        title="Active sessions"
        description="Revoke any device you do not recognise."
        icon={Laptop}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadSessions} disabled={sessionState.loading}>
              Refresh
            </Button>
            <Button variant="danger" size="sm" onClick={logoutAll}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out all
            </Button>
          </div>
        }
      >
        {sessionState.error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{sessionState.error}</p>
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
                <div>
                  <p className="text-sm font-medium text-primary-text dark:text-white">
                    {session.userAgent || "Unknown device"}
                    {session.current && (
                      <span className="ml-2 text-xs font-medium text-green-700 dark:text-green-400">This device</span>
                    )}
                  </p>
                  <p className="text-xs text-secondary-text dark:text-gray-400">
                    IP {session.ipAddress || "unknown"} · started {formatDate(session.createdAt)}
                  </p>
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
      </Section>
    </div>
  );
}
