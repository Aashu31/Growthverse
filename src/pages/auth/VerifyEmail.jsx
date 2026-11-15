import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, MailCheck, ArrowRight } from "lucide-react";
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
      <div className="text-center py-6 space-y-4">
        <div className="animate-spin rounded-full border-2 border-champagne border-t-transparent h-10 w-10 mx-auto mb-4" />
        <h1 className="text-2xl font-serif font-bold text-light-text">Validating Security Token</h1>
        <p className="text-xs sm:text-sm text-warm-grey">Please wait while your email token is verified...</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-champagne/15 border border-champagne/30 text-champagne flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-light-text">Email Verified</h1>
        <p className="text-xs sm:text-sm text-warm-grey">{message}</p>
        <div className="pt-4">
          <Link
            to="/login?verified=1"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center justify-center gap-2 shadow"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-champagne/15 border border-champagne/30 text-champagne flex items-center justify-center mx-auto mb-3">
          {state === "missing" ? <MailCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-light-text">
          {state === "missing" ? "Verification Required" : "Link Expired or Invalid"}
        </h1>
        <p className="text-xs sm:text-sm text-warm-grey mt-2">
          {state === "missing"
            ? "Open the verification link sent to your inbox, or request a fresh link below."
            : message}
        </p>
      </div>

      {resendState.error && (
        <p className="mb-4 text-xs text-red-400 font-medium" role="alert">{resendState.error}</p>
      )}
      {resendState.message && (
        <p className="mb-4 text-xs text-green-300 font-medium" role="status">{resendState.message}</p>
      )}

      <form onSubmit={handleResend} className="space-y-4">
        <FormInput
          label="Registered Email Address"
          type="email"
          name="email"
          id="resend-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={resendState.submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-champagne via-caramel to-champagne bg-[length:200%_auto] hover:bg-[position:right_center] text-espresso font-bold text-sm shadow-md hover:shadow-glow-gold hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {resendState.submitting ? "Sending..." : "Resend Verification Link ↗"}
          </button>
        </div>
      </form>
    </div>
  );
}
