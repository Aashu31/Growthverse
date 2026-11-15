import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/common/Button";

const FEATURE_CATEGORIES = [
  {
    title: "Student Management",
    description:
      "Manage student records, enrollment, and academic information in one place.",
  },
  {
    title: "Attendance Management",
    description:
      "Track student attendance, generate reports, and monitor patterns easily.",
  },
  {
    title: "Academic Management",
    description:
      "Organize classes, subjects, timetables, and academic schedules efficiently.",
  },
  {
    title: "Fee Management",
    description:
      "Handle fee collection, invoicing, payment tracking, and financial reports.",
  },
  {
    title: "Parent Communication",
    description:
      "Stay connected with parents through announcements, messages, and updates.",
  },
  {
    title: "Reports & Insights",
    description:
      "Generate academic reports, performance analytics, and institutional insights.",
  },
];

export default function Sarthi() {
  return (
    <div className="min-h-screen bg-white dark:bg-charcoal-dark text-charcoal dark:text-white">
      {/* Hero */}
      <section className="relative bg-charcoal-dark py-24 lg:py-32 text-white overflow-hidden">
        <div className="container-premium relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="badge-accent mb-4 block">School Management Solution</span>
            <h1 className="text-h1 mb-6">Sarthi</h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed mb-8">
              A school management solution presented as a GrowthVerse service
              offering. Sarthi helps educational institutions digitize their
              operations and improve administrative efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary">
                Enquire About Sarthi
              </a>
              <a href="/services" className="btn-secondary">
                View All Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section-padding bg-surface dark:bg-charcoal-dark">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h3 mb-6">About Sarthi</h2>
            <p className="text-muted dark:text-gray-400 max-w-2xl mx-auto">
              Feature presentation within the GrowthVerse platform.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-h3 mb-4">Digital School Management</h3>
              <p className="text-muted dark:text-gray-400 leading-relaxed mb-6">
                Sarthi is positioned as a school management solution under the
                GrowthVerse brand. It presents feature categories that help
                educational institutions manage their operations through
                digital tools.
              </p>
              <div className="space-y-4">
                {[
                  "Student enrollment and record management",
                  "Attendance tracking and reporting",
                  "Academic scheduling and subject management",
                  "Fee collection and payment tracking",
                  "Parent-teacher communication",
                  "Performance reports and analytics",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-forest-light flex-shrink-0 mt-0.5 flex items-center justify-center text-forest-dark">
                      <span className="text-[10px]">✓</span>
                    </div>
                    <span className="text-muted dark:text-gray-400 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-full h-[400px] rounded-xl border border-dark-border bg-charcoal p-8 relative overflow-hidden flex flex-col justify-center items-center text-center">
                <div className="w-32 h-32 rounded-full bg-forest/20 flex items-center justify-center mb-6 text-forest-light">
                  <span className="text-[48px]">🏫</span>
                </div>
                <p className="text-gray-400 text-sm">Feature Presentation Only</p>
                <p className="text-xs text-gray-500 mt-2">
                  Sarthi software is not developed in this project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h3 mb-6">Feature Categories</h2>
            <p className="text-muted dark:text-gray-400 max-w-2xl mx-auto">
              Explore the capabilities presented in Sarthi.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURE_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.title}
                className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-forest-light text-forest-dark">
                  <span className="text-[20px]">●</span>
                </div>
                <h4 className="font-semibold text-charcoal dark:text-white mb-3">
                  {cat.title}
                </h4>
                <p className="text-muted dark:text-gray-400 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-charcoal-dark text-white">
        <div className="container-premium">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-h2 mb-6">Interested in Sarthi?</h2>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              Contact us to learn more about how Sarthi can support your
              educational institution's digital needs.
            </p>
            <a href="/contact" className="btn-primary">
              Send Enquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
