import React from "react";

export default function Sarthi() {
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

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="relative bg-dark py-24 lg:py-32 text-white overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="container-premium relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-violet-400 font-medium uppercase tracking-wider text-sm">
              School Management Solution
            </span>
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

      <section className="section-padding bg-gray-50 dark:bg-dark-secondary">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">About Sarthi</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Feature presentation within the GrowthVerse platform.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-h3 mb-4">Digital School Management</h3>
              <p className="text-secondary-text dark:text-gray-300 leading-relaxed mb-6">
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
                    <div className="w-5 h-5 rounded-full bg-violet-600/20 text-violet-400 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-secondary-text dark:text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-full h-[400px] rounded-3xl border border-gray-700 bg-dark-secondary p-8 relative overflow-hidden flex flex-col justify-center items-center text-center">
                <div className="w-32 h-32 rounded-full bg-violet-600/20 flex items-center justify-center mb-6">
                  <svg className="h-16 w-16 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
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

      <section className="section-padding">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Feature Categories</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Explore the capabilities presented in Sarthi.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURE_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.title}
                className="p-8 rounded-3xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-electric-blue">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0-4V2m0 2a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0-4V2" />
                  </svg>
                </div>
                <h4 className="font-semibold text-primary-text dark:text-white mb-3">
                  {cat.title}
                </h4>
                <p className="text-secondary-text dark:text-gray-300 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-dark-secondary">
        <div className="container-premium">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-h2 mb-6">Interested in Sarthi?</h2>
            <p className="text-secondary-text dark:text-gray-300 text-lg mb-10 leading-relaxed">
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
