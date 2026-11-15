import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Mail, MessageSquare, PhoneCall, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck } from "lucide-react";
import { SectionHeader } from "../../components/website/Hero";

const PROJECT_TYPE_OPTIONS = [
  "Website Development",
  "Web Application Development",
  "UI/UX Design",
  "Mobile Application Development",
  "AI and Automation",
  "Cloud and DevOps",
  "Digital Branding",
  "Digital Marketing",
  "Sarthi - School Management Solution",
];

const WEB3FORMS_ACCESS_KEY = "8af1e732-87a4-4f9f-b3cf-b102529573bc";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    projectType: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid business email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter a project description.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please provide more details (at least 10 characters).";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);
    setSubmitMessage("");

    const formDataObj = new FormData();
    formDataObj.append("access_key", WEB3FORMS_ACCESS_KEY);
    formDataObj.append("name", formData.fullName);
    formDataObj.append("email", formData.email);
    formDataObj.append("subject", formData.subject || "GrowthVerse Project Enquiry");
    formDataObj.append("project_type", formData.projectType || "Not specified");
    formDataObj.append("message", formData.message);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitResult("success");
        setSubmitMessage("Thank you! Your enquiry has been received. Our leadership will review and respond promptly.");
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          projectType: "",
          message: "",
        });
      } else {
        setSubmitResult("error");
        setSubmitMessage(
          data.message || "Failed to submit enquiry. Please try again."
        );
      }
    } catch (err) {
      setSubmitResult("error");
      setSubmitMessage(
        "Network connection error. Please verify your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Project</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            Let's Build Something{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
              Extraordinary.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed">
            Have a project in mind, need technical guidance, or want to explore an
            enterprise partnership? Share your vision with our team.
          </p>
        </div>
      </section>

      {/* Contact Section (Warm Cream Palette) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Direct Communication Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-caramel mb-2 block">
                  Get In Touch
                </span>
                <h2 className="text-3xl font-serif font-bold text-dark-text">
                  Direct Line to Engineering & Strategy
                </h2>
                <p className="text-xs sm:text-sm text-dark-mocha/70 mt-3 leading-relaxed">
                  Every enquiry is evaluated directly by our technical leads. No automated
                  sales gatekeepers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-gv-border flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-sand-beige/60 border border-champagne/30 flex items-center justify-center text-caramel shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-dark-text">Written Enquiries</h4>
                    <p className="text-xs text-dark-mocha/70 mt-0.5">
                      Submissions via this form are routed to leadership within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-gv-border flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-sand-beige/60 border border-champagne/30 flex items-center justify-center text-caramel shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-dark-text">Project Scope Discussion</h4>
                    <p className="text-xs text-dark-mocha/70 mt-0.5">
                      We provide architectural breakdowns, delivery timelines, and honest fixed pricing.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-gv-border flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-sand-beige/60 border border-champagne/30 flex items-center justify-center text-caramel shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-dark-text">Guaranteed Support</h4>
                    <p className="text-xs text-dark-mocha/70 mt-0.5">
                      Includes 3 months of free post-launch support on every development package.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Web3Forms Integration */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-gv-border shadow-card-warm-lg">
                {submitResult === "success" && (
                  <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-green-900 space-y-3">
                    <div className="flex items-center gap-2 font-serif font-bold text-base">
                      <CheckCircle2 className="w-5 h-5 text-green-700" />
                      <span>Enquiry Submitted Successfully</span>
                    </div>
                    <p className="text-xs leading-relaxed">{submitMessage}</p>
                    <button
                      type="button"
                      onClick={() => setSubmitResult(null)}
                      className="px-4 py-2 rounded-lg bg-green-700 text-white font-semibold text-xs mt-2"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}

                {submitResult === "error" && (
                  <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2 mb-6">
                    <div className="flex items-center gap-2 font-serif font-bold text-base">
                      <AlertCircle className="w-5 h-5 text-red-700" />
                      <span>Submission Error</span>
                    </div>
                    <p className="text-xs leading-relaxed">{submitMessage}</p>
                  </div>
                )}

                {submitResult !== "success" && (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-dark-mocha mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.fullName ? "border-red-500 ring-2 ring-red-500/20" : "border-gv-border"
                        } bg-[#FAF3E8]/50 text-dark-text text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all`}
                        placeholder="e.g. Alexander Vance"
                        required
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-dark-mocha mb-2">
                        Business Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.email ? "border-red-500 ring-2 ring-red-500/20" : "border-gv-border"
                        } bg-[#FAF3E8]/50 text-dark-text text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all`}
                        placeholder="alex@enterprise.com"
                        required
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-dark-mocha mb-2">
                          Subject (Optional)
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gv-border bg-[#FAF3E8]/50 text-dark-text text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all"
                          placeholder="e.g. Website Redesign"
                        />
                      </div>

                      <div>
                        <label htmlFor="projectType" className="block text-xs font-bold uppercase tracking-wider text-dark-mocha mb-2">
                          Project Type
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gv-border bg-[#FAF3E8]/50 text-dark-text text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all"
                        >
                          <option value="">Select project type</option>
                          {PROJECT_TYPE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-dark-mocha mb-2">
                        Project Overview & Goals <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.message ? "border-red-500 ring-2 ring-red-500/20" : "border-gv-border"
                        } bg-[#FAF3E8]/50 text-dark-text text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all`}
                        placeholder="Tell us about your timeline, targets, and scope..."
                        required
                      />
                      {errors.message && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-champagne via-caramel to-champagne bg-[length:200%_auto] hover:bg-[position:right_center] text-espresso font-bold text-sm shadow-md hover:shadow-glow-gold hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? "Transmitting Enquiry..." : "Send Project Message ↗"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
