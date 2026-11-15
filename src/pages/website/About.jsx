import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/common/Button";

const TEAM_MEMBERS = [
  {
    name: "Product Designer",
    role: "UI/UX Design",
    bio: "Leads design strategy and user experience across all digital products.",
  },
  {
    name: "Frontend Architect",
    role: "Web Development",
    bio: "Specializes in React architecture and modern frontend engineering.",
  },
  {
    name: "Digital Strategist",
    role: "Business Solutions",
    bio: "Helps businesses define their digital transformation roadmap.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-charcoal-dark text-charcoal dark:text-white">
      {/* Hero */}
      <section className="relative bg-charcoal-dark py-20 lg:py-32 text-white overflow-hidden">
        <div className="container-premium relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="badge-accent mb-4 block">About Us</span>
            <h1 className="text-h2 mb-6">Our Story</h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
              GrowthVerse is a digital technology and solutions company
              dedicated to helping businesses establish and improve their
              digital presence through thoughtful design and modern development.
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-h3">Company Introduction</h2>
              <p className="text-muted dark:text-gray-400 text-lg leading-relaxed mb-6">
                GrowthVerse was founded with a simple mission: to help
                businesses, startups, and entrepreneurs build powerful digital
                experiences that drive growth. We combine technical expertise
                with creative design to deliver solutions that work.
              </p>
              <p className="text-muted dark:text-gray-400 text-lg leading-relaxed mb-6">
                Our focus is on frontend excellence — creating websites and
                web applications that are fast, accessible, and visually
                compelling. We believe great digital experiences start with
                understanding your business goals.
              </p>
              <div className="flex gap-4">
                <a href="/services" className="btn-primary">
                  Explore Services
                </a>
                <a href="/contact" className="btn-secondary">
                  Contact Us
                </a>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-full h-[400px] rounded-xl border border-border dark:border-dark-border bg-surface dark:bg-charcoal p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-semibold text-charcoal dark:text-white mb-4">Digital Technology &amp; Solutions</h4>
                  <div className="space-y-4">
                    {[
                      "Modern web applications",
                      "Responsive user interfaces",
                      "Digital branding &amp; design",
                      "AI and automation concepts",
                      "Cloud and DevOps solutions",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-muted dark:text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-forest" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-surface dark:bg-charcoal-dark">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h3 mb-6">Our Vision &amp; Mission</h2>
            <p className="text-muted dark:text-gray-400 max-w-2xl mx-auto">
              Guiding principles behind everything we build.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark">
              <div className="w-12 h-12 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark mb-6">
                <span className="text-[16px]">●</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-3">Our Vision</h3>
              <p className="text-muted dark:text-gray-400 leading-relaxed">
                To help businesses build, improve, and scale their digital
                presence through modern, responsive, and accessible frontend
                technology solutions.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark">
              <div className="w-12 h-12 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark mb-6">
                <span className="text-[16px]">●</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-3">Our Mission</h3>
              <p className="text-muted dark:text-gray-400 leading-relaxed">
                GrowthVerse delivers digital experiences that support business
                growth — from public-facing marketing websites to frontend
                dashboards that streamline business operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h3 mb-6">Core Values</h2>
            <p className="text-muted dark:text-gray-400 max-w-2xl mx-auto">
              What drives us forward.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Innovation", desc: "We embrace new technologies and creative approaches." },
              { title: "Reliability", desc: "We deliver on our promises with consistent quality." },
              { title: "Professionalism", desc: "We maintain high standards in every interaction." },
            ].map((value, idx) => (
              <div
                key={value.title}
                className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark"
              >
                <h4 className="font-semibold text-charcoal dark:text-white mb-3">{value.title}</h4>
                <p className="text-muted dark:text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white dark:bg-charcoal-dark">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h3 mb-6">Our Team</h2>
            <p className="text-muted dark:text-gray-400 max-w-2xl mx-auto">
              Placeholder team profiles until actual team information is provided.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={member.name}
                className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark text-center"
              >
                <div className="w-20 h-20 rounded-full bg-surface dark:bg-charcoal flex items-center justify-center mx-auto mb-6 text-muted dark:text-gray-400">
                  <span className="text-lg font-medium">{member.name.charAt(0)}</span>
                </div>
                <h4 className="font-semibold text-charcoal dark:text-white mb-1">{member.name}</h4>
                <p className="text-forest-dark dark:text-forest-light text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-muted dark:text-gray-400 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted dark:text-gray-400 text-sm mt-8">
            Team profiles use placeholder labels. Actual team information will be added when available.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-charcoal-dark text-white">
        <div className="container-premium">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h2 className="text-h2 mb-6">Ready to Build Something Great?</h2>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              Let's create your digital presence together. Reach out to us today.
            </p>
            <a href="/contact" className="btn-primary">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
