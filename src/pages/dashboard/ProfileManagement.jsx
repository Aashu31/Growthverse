import React, { useEffect, useState } from "react";
import { Building2, Globe, Mail, MapPin, Phone, Save, ShieldAlert } from "lucide-react";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { PERMISSIONS } from "../../utils/permissions";
import { ApiError } from "../../api/client";

const FIELDS = [
  { key: "companyName", label: "Company name", icon: Building2, required: true },
  { key: "tagline", label: "Tagline", icon: null },
  { key: "website", label: "Website", icon: Globe, type: "url" },
  { key: "contactEmail", label: "Contact email", icon: Mail, type: "email" },
  { key: "contactPhone", label: "Contact phone", icon: Phone },
  { key: "businessAddress", label: "Business address", icon: MapPin, span: "full" },
  { key: "socialGitHub", label: "GitHub URL", icon: Globe, type: "url" },
  { key: "socialLinkedIn", label: "LinkedIn URL", icon: Globe, type: "url" },
  { key: "socialTwitter", label: "X / Twitter URL", icon: Globe, type: "url" },
  { key: "description", label: "Company description", icon: null, type: "textarea", span: "full" },
];

const EMPTY = FIELDS.reduce((result, field) => ({ ...result, [field.key]: "" }), {});

export default function ProfileManagement() {
  const { hasPermission } = useAuth();
  const { settings, updateSettings, loading } = useData();
  const canManage = hasPermission(PERMISSIONS.SETTINGS_MANAGE);
  const [form, setForm] = useState(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(
      FIELDS.reduce(
        (result, field) => ({
          ...result,
          [field.key]: settings?.[field.key] === undefined || settings?.[field.key] === null
            ? ""
            : String(settings[field.key]),
        }),
        {}
      )
    );
  }, [settings]);

  const handleChange = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      await updateSettings(
        FIELDS.reduce((result, field) => ({ ...result, [field.key]: form[field.key] || "" }), {})
      );
      setMessage("Company profile updated.");
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Unable to save the profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 text-dark-text dark:text-light-text">Company Profile</h2>
        <p className="text-warm-grey dark:text-dark-mocha/60 mt-1">
          Public company information served by the settings API.
        </p>
      </div>

      {!canManage && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
          <ShieldAlert className="h-5 w-5 mt-0.5 shrink-0" />
          <span>You can view the company profile, but only a super administrator can change it.</span>
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-300">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-premium p-6 md:p-8">
        {loading.settings && !settings?.companyName && (
          <p className="text-sm text-warm-grey dark:text-dark-mocha/60 mb-4">Loading profile...</p>
        )}
        <div className="grid md:grid-cols-2 gap-5">
          {FIELDS.map((field) => {
            const Icon = field.icon;
            const common =
              "w-full px-4 py-3 rounded-xl border border-gv-border dark:border-gv-border-dark bg-white dark:bg-deep-coffee text-dark-text dark:text-light-text focus:outline-none focus:ring-2 focus:ring-champagne/40 disabled:opacity-60";
            return (
              <div key={field.key} className={field.span === "full" ? "md:col-span-2" : ""}>
                <label htmlFor={`profile-${field.key}`} className="block text-sm font-medium text-dark-text dark:text-light-text mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-grey pointer-events-none" />
                  )}
                  {field.type === "textarea" ? (
                    <textarea
                      id={`profile-${field.key}`}
                      value={form[field.key]}
                      onChange={(event) => handleChange(field.key, event.target.value)}
                      rows={4}
                      disabled={!canManage}
                      className={common}
                    />
                  ) : (
                    <input
                      id={`profile-${field.key}`}
                      type={field.type || "text"}
                      value={form[field.key]}
                      onChange={(event) => handleChange(field.key, event.target.value)}
                      required={field.required}
                      disabled={!canManage}
                      className={`${common} ${Icon ? "pl-10" : ""}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {canManage && (
          <div className="flex justify-end pt-6 mt-6 border-t border-gv-border dark:border-gv-border-dark">
            <Button type="submit" variant="primary" loading={isSaving}>
              <Save className="h-4 w-4 mr-2" /> Save profile
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
