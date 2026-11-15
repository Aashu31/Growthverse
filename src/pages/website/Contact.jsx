import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/common/Button";
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
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter a message.";
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
    formDataObj.append("subject", formData.subject || "No subject");
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
        setSubmitMessage("Thank you! Your message has been sent successfully.");
        // Clear form after successful submission
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
          data.message || "Failed to send your message. Please try again."
        );
      }
    } catch (err) {
      setSubmitResult("error");
      setSubmitMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal dark:bg-charcoal-dark dark:text-white">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left side: Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="badge-accent mb-4 block">Contact Us</span>
                <h2 className="text-h2">Let's Build Something Meaningful.</h2>
                <p className="text-muted dark:text-gray-400 leading-relaxed">
                  Have a digital project in mind? Whether you need a website,
                  web application, or digital strategy, we're here to help you
                  build and grow your business.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark flex-shrink-0">
                    <span className="text-[16px]">✉</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white">Email Us</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
                      Use the contact form below to send us a message.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark flex-shrink-0">
                    <span className="text-[16px]">●</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white">Project Discussion</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
                      Tell us about your project goals, timeline, and budget.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark flex-shrink-0">
                    <span className="text-[16px]">●</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white">Next Steps</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
                      We'll review your enquiry and respond as soon as possible.
                    </p>
                  </div>
                </div>
              </div>

              <a href="/services" className="btn-secondary">
                View Our Services <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            {/* Right side: Form */}
            <div className="space-y-6">
              {submitResult === "success" && (
                <div className="p-6 rounded-xl border border-forest/30 bg-forest-light/50 text-forest-dark">
                  <h4 className="font-semibold mb-2">Message Sent</h4>
                  <p className="text-sm">{submitMessage}</p>
                  <button
                    onClick={() => setSubmitResult(null)}
                    className="mt-4 text-sm font-medium text-forest-dark hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              )}
              {submitResult === "error" && (
                <div className="p-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200">
                  <h4 className="font-semibold mb-2">Submission Failed</h4>
                  <p className="text-sm">{submitMessage || "Please try again."}</p>
                </div>
              )}
              {submitResult === null && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-charcoal dark:text-white block"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? "border-red-500" : "border-border"} bg-white dark:bg-charcoal text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-forest/50 transition-colors ${errors.fullName ? "ring-red-500/20" : ""}`}
                      placeholder="John Doe"
                      required
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-charcoal dark:text-white block"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500" : "border-border"} bg-white dark:bg-charcoal text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-forest/50 transition-colors ${errors.email ? "ring-red-500/20" : ""}`}
                      placeholder="john@company.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-charcoal dark:text-white block"
                    >
                      Subject (optional)
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-forest/50 transition-colors"
                      placeholder="e.g., Website Redesign"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="projectType"
                      className="text-sm font-medium text-charcoal dark:text-white block"
                    >
                      Project Type (optional)
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-forest/50 transition-colors"
                    >
                      <option value="">Select a project type</option>
                      {PROJECT_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-charcoal dark:text-white block"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.message ? "border-red-500" : "border-border"} bg-white dark:bg-charcoal text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-forest/50 transition-colors ${errors.message ? "ring-red-500/20" : ""}`}
                      placeholder="Tell us about your project..."
                      required
                    />
                    {errors.message && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
