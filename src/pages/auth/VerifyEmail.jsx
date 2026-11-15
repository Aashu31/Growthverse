import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, MailCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { FormInput } from "../../components/common/Forms";

export default function VerifyEmail() {
  const { verifyEmail, resendVerification } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, setState] = useState(token ? "verifying" : "missing");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendState, setResendState] = useState({ submitting: false, message: "", error: "" });
  const started = useRef(false);

  const runVerification = useCallback(async () => {
    if (!token) return;
    setState("verifying");
    try {
      const response = await verifyEmail(token);
      setMessage(response?.message || "Email verified successfully.");
      setState("success");
    } catch (error) {
      setMessage(error?.message || "This verification link is invalid or has expired.");
      setState("error");
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    runVerification();
  }, [runVerification]);

  const handleResend = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setResendState({ submitting: false, message: "", error: "Enter the email you registered with." });
      return;
    }
    setResendState({ submitting: true, message: "", error: "" });
    try {
      const response = await resendVerification({ email: email.trim() });
      setResendState({
        submitting: false,
        message: response?.message || "If that account requires verification, a new email has been sent.",
        error: "",
      });
    } catch (error) {
      setResendState({
        submitting: false,
        message: "",
        error: error?.message || "Unable to resend the verification email right now.",
      });
    }
  };

  if (state === "verifying") {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full border-2 border-forest border-t-transparent h-10 w-10 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display mb-2">Verifying your email</h1>
        <p className="text-sm text-muted dark:text-gray-400">One moment while we validate your link.</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-forest-light dark:bg-forest/20 text-forest-dark dark:text-forest-light flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display mb-3">Email verified</h1>
        <p className="text-sm text-muted dark:text-gray-400 mb-8">{message}</p>
        <Link to="/login?verified=1" className="btn-primary inline-flex px-6 py-3">Sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          {state === "missing" ? <MailCheck className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
        </div>
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display">
          {state === "missing" ? "Verification required" : "Link not valid"}
        </h1>
        <p className="text-sm text-muted dark:text-gray-400 mt-2">
          {state === "missing"
            ? "Open the verification link from your email, or request a new one below."
            : message}
        </p>
      </div>

      {resendState.error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">{resendState.error}</p>
      )}
      {resendState.message && (
        <p className="mb-4 text-sm text-green-700 dark:text-green-400" role="status">{resendState.message}</p>
      )}

      <form onSubmit={handleResend} className="space-y-4">
        <FormInput
          label="Email address"
          type="email"
          name="email"
          id="resend-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
        <button type="submit" disabled={resendState.submitting} className="btn-primary w-full py-3.5 disabled:opacity-60">
          {resendState.submitting ? "Sending..." : "Resend verification email"}
        </button>
      </form>
    </div>
  );
}
