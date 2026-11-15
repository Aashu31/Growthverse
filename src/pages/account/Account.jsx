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
  ArrowRight,
  Sparkles,
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
    <section className="bg-deep-coffee/80 backdrop-blur-xl rounded-3xl border border-champagne/20 p-6 md:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-champagne/15 border border-champagne/30 text-champagne flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-serif font-bold text-light-text">{title}</h2>
            {description && <p className="text-xs text-warm-grey">{description}</p>}
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
      setProfileState({ saving: false, message: "Profile successfully updated.", error: "" });
    } catch (error) {
      setProfileState({
        saving: false,
        message: "",
        error: error instanceof ApiError ? error.message : "Unable to update profile.",
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
        message: response?.message || "Password updated.",
        error: "",
      });
      loadSessions();
    } catch (error) {
      setPasswordState({
        saving: false,
        message: "",
        error: error instanceof ApiError ? error.message : "Unable to update password.",
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
        error: error instanceof ApiError ? error.message : "Unable to revoke session.",
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
          "If verification is required, a new email has been transmitted.",
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
    <div className="min-h-screen bg-espresso text-light-text py-12 selection:bg-champagne selection:text-espresso">
      <div className="container-premium space-y-8">
        {/* Top Header Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-deep-coffee via-dark-mocha to-deep-coffee border border-champagne/25 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-champagne to-caramel text-espresso font-serif text-2xl font-bold flex items-center justify-center shadow-lg">
              {(user?.name || "GV").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-light-text">
                {user?.name || "Client Portal"}
              </h1>
              <p className="text-xs text-warm-grey mt-1">
                {user?.email} ·{" "}
                <span className="text-champagne font-semibold">{roleLabel(user?.role)}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {isStaff && (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center gap-2 shadow"
              >
                <span>Staff Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 rounded-full border border-champagne/30 text-light-text hover:text-champagne hover:border-champagne text-xs font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {!user?.emailVerified && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-900/20 p-5">
            <div className="flex items-start gap-3">
              <MailWarning className="w-5 h-5 text-amber-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-200">Email Verification Required</p>
                <p className="text-xs text-warm-grey mt-1">
                  Please verify your email address to ensure you receive security and milestone notices.
                </p>
                {verifyState.message && (
                  <p className="text-xs text-amber-300 mt-2 break-all">{verifyState.message}</p>
                )}
                {verifyState.error && (
                  <p className="text-xs text-red-400 mt-2">{verifyState.error}</p>
                )}
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={verifyState.sending}
                  className="mt-2 text-xs font-bold text-champagne underline hover:text-light-gold disabled:opacity-60"
                >
                  {verifyState.sending ? "Sending..." : "Resend Verification Email"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <Section title="Account Information" description="Your contact credentials & phone number." icon={User}>
            {profileState.message && (
              <p className="mb-4 flex items-center gap-2 text-xs text-green-400">
                <CheckCircle2 className="w-4 h-4" /> {profileState.message}
              </p>
            )}
            {profileState.error && (
              <p className="mb-4 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4" /> {profileState.error}
              </p>
            )}
            <form onSubmit={handleProfileSubmit} className="space-y-4" noValidate>
              <FormInput
                label="Full Name"
                name="name"
                id="account-name"
                value={profile.name}
                onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              <FormInput
                label="Phone Number"
                name="phone"
                id="account-phone"
                value={profile.phone}
                onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Optional"
              />
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-warm-grey mb-1.5">Email Address</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-champagne/20 bg-espresso/60 text-sm text-warm-grey">
                  <Mail className="w-4 h-4 text-champagne" /> {user?.email}
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileState.saving}
                  className="px-6 py-2.5 rounded-xl bg-champagne text-espresso font-bold text-xs shadow hover:bg-light-gold transition-colors"
                >
                  {profileState.saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </Section>

          {/* Password Section */}
          <Section title="Security & Password" description="Update your access passphrase." icon={KeyRound}>
            {passwordState.message && (
              <p className="mb-4 flex items-center gap-2 text-xs text-green-400">
                <CheckCircle2 className="w-4 h-4" /> {passwordState.message}
              </p>
            )}
            {passwordState.error && (
              <p className="mb-4 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4" /> {passwordState.error}
              </p>
            )}
            <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
              <FormInput
                label="Current Password"
                type="password"
                name="currentPassword"
                id="account-current-password"
                value={password.currentPassword}
                onChange={(event) => setPassword((prev) => ({ ...prev, currentPassword: event.target.value }))}
                autoComplete="current-password"
                required
              />
              <FormInput
                label="New Password"
                type="password"
                name="newPassword"
                id="account-new-password"
                value={password.newPassword}
                onChange={(event) => setPassword((prev) => ({ ...prev, newPassword: event.target.value }))}
                autoComplete="new-password"
                required
              />
              <FormInput
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                id="account-confirm-password"
                value={password.confirmPassword}
                onChange={(event) => setPassword((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                autoComplete="new-password"
                required
              />
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordState.saving}
                  className="px-6 py-2.5 rounded-xl bg-champagne text-espresso font-bold text-xs shadow hover:bg-light-gold transition-colors"
                >
                  {passwordState.saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </Section>
        </div>

        {/* Customer Record */}
        {customer && (
          <Section title="Client Organization Record" description="Official company entity linked to your account." icon={ShieldCheck}>
            <dl className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-espresso/60 border border-white/5">
                <dt className="text-warm-grey">Company</dt>
                <dd className="text-light-text font-bold text-sm mt-0.5">{customer.company || "Not set"}</dd>
              </div>
              <div className="p-4 rounded-xl bg-espresso/60 border border-white/5">
                <dt className="text-warm-grey">Phone</dt>
                <dd className="text-light-text font-bold text-sm mt-0.5">{customer.phone || "Not set"}</dd>
              </div>
              <div className="p-4 rounded-xl bg-espresso/60 border border-white/5">
                <dt className="text-warm-grey">Country</dt>
                <dd className="text-light-text font-bold text-sm mt-0.5">{customer.country || "Not set"}</dd>
              </div>
              <div className="p-4 rounded-xl bg-espresso/60 border border-white/5">
                <dt className="text-warm-grey">Account Status</dt>
                <dd className="mt-1"><StatusBadge value={customer.status} /></dd>
              </div>
            </dl>
          </Section>
        )}

        {/* Orders for Clients */}
        {!isStaff && (
          <Section
            title="My Orders & Engagements"
            description="Active & completed project deliverables."
            icon={ShoppingBag}
            action={
              <button
                type="button"
                onClick={loadOrders}
                disabled={ordersState.loading}
                className="px-3 py-1.5 rounded-lg border border-champagne/30 text-xs font-semibold text-warm-grey hover:text-champagne transition-colors"
              >
                Refresh
              </button>
            }
          >
            {ordersState.error && (
              <p className="mb-4 text-xs text-red-400">{ordersState.error}</p>
            )}
            {ordersState.loading ? (
              <p className="text-xs text-warm-grey">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-warm-grey py-4">No active or past orders found on record.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-warm-grey uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-semibold">Order</th>
                      <th className="pb-3 font-semibold">Project</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 last:border-0">
                        <td className="py-3 font-semibold text-light-text">{order.orderNumber}</td>
                        <td className="py-3 text-warm-grey">{order.projectTitle}</td>
                        <td className="py-3 text-champagne font-bold">
                          {order.currency || "INR"} {Number(order.amount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 text-warm-grey">{formatDate(order.createdAt)}</td>
                        <td className="py-3"><StatusBadge value={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        )}

        {/* Active Sessions */}
        <Section
          title="Active Device Sessions"
          description="Manage logged-in instances across browsers & devices."
          icon={Laptop}
          action={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadSessions}
                disabled={sessionState.loading}
                className="px-3 py-1.5 rounded-lg border border-champagne/30 text-xs font-semibold text-warm-grey hover:text-champagne transition-colors"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={logoutAll}
                className="px-3 py-1.5 rounded-lg bg-red-900/30 border border-red-500/30 text-xs font-semibold text-red-300 hover:bg-red-900/50 transition-colors"
              >
                Sign Out All
              </button>
            </div>
          }
        >
          {sessionState.error && (
            <p className="mb-4 text-xs text-red-400">{sessionState.error}</p>
          )}
          {sessionState.loading ? (
            <p className="text-xs text-warm-grey">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-warm-grey py-2">No active sessions found.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-espresso/50 p-4"
                >
                  <div>
                    <p className="text-xs font-semibold text-light-text">
                      {session.userAgent || "Unknown device browser"}
                      {session.current && (
                        <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-champagne/20 text-champagne border border-champagne/30">
                          Current Device
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-warm-grey mt-0.5">
                      IP {session.ipAddress || "unknown"} · Started {formatDate(session.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRevoke(session)}
                    disabled={revokingId === session.id}
                    className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 text-xs font-semibold self-start sm:self-auto transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                    <span>Revoke</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
