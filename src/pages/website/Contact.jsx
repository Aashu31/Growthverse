import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { validateContactForm } from "../../utils/validators";

const SERVICE_OPTIONS = [
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

const BUDGET_OPTIONS = [
  "Under $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
];

const TIMELINE_OPTIONS = [
  "ASAP",
  "1-4 weeks",
  "1-3 months",
  "3-6 months",
  "6+ months",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    serviceRequired: "",
    budgetRange: "",
    projectTimeline: "",
    projectDescription: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        // Frontend-only: store demonstration enquiry locally
        const enquiry = { ...formData, id: Date.now(), submittedAt: new Date().toISOString() };
        try {
          const existing = JSON.parse(localStorage.getItem("growthverse-contact-demo") || "[]");
          localStorage.setItem("growthverse-contact-demo", JSON.stringify([...existing, enquiry]));
        } catch (err) {
          console.error("LocalStorage error:", err);
        }
      }, 1500);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
        <div className="max-w-md w-full bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 shadow-2xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-h3 text-primary-text dark:text-white mb-3">Message Sent</h2>
          <p className="text-secondary-text dark:text-gray-300 mb-8">
            Your enquiry has been recorded locally for demonstration purposes.
            This is a frontend-only submission; no email was delivered and no
            server received your message.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-blue-600 dark:text-electric-blue font-medium uppercase tracking-wider text-sm">
                  Contact Us
                </span>
                <h2 className="text-h2">Get in Touch</h2>
                <p className="text-secondary-text dark:text-gray-300 leading-relaxed">
                  Have a project in mind? Send us a message and we'll respond
                  as soon as possible. This is a frontend contact form — all
                  submissions are stored locally for demonstration only.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    value: "hello@growthverse.example",
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    value: "+1 (555) 000-0000",
                  },
                  {
                    icon: MapPin,
                    title: "Location",
                    value: "Placeholder Address",
                  },
                  {
                    icon: Clock,
                    title: "Hours",
                    value: "Mon - Fri, 9:00 AM - 6:00 PM",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue flex-shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-text dark:text-white">{item.title}</h4>
                      <p className="text-secondary-text dark:text-gray-300 text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-text dark:text-white block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.fullName ? "ring-red-500/20" : ""}`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-text dark:text-white block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.email ? "ring-red-500/20" : ""}`}
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-text dark:text-white block">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.phone ? "ring-red-500/20" : ""}`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.phone}</p>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-text dark:text-white block">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.companyName ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.companyName ? "ring-red-500/20" : ""}`}
                      placeholder="Acme Corp"
                    />
                    {errors.companyName && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.companyName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-text dark:text-white block">
                      Service Required <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="serviceRequired"
                      value={formData.serviceRequired}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.serviceRequired ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.serviceRequired ? "ring-red-500/20" : ""}`}
                    >
                      <option value="">Select a service</option>
                      {SERVICE_OPTIONS.map((svc) => (
                        <option key={svc} value={svc}>{svc}</option>
                      ))}
                    </select>
                    {errors.serviceRequired && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.serviceRequired}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-text dark:text-white block">
                    Budget Range <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.budgetRange ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.budgetRange ? "ring-red-500/20" : ""}`}
                  >
                    <option value="">Select budget</option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  {errors.budgetRange && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.budgetRange}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-text dark:text-white block">
                    Project Timeline <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="projectTimeline"
                    value={formData.projectTimeline}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.projectTimeline ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.projectTimeline ? "ring-red-500/20" : ""}`}
                  >
                    <option value="">Select timeline</option>
                    {TIMELINE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.projectTimeline && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.projectTimeline}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-text dark:text-white block">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.projectDescription ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.projectDescription ? "ring-red-500/20" : ""}`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.projectDescription && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.projectDescription}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4"
                >
                  {isSubmitting ? "Sending..." : "Submit Enquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
