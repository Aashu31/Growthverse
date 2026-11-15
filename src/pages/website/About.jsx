import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LuArrowRight } from "lucide-react";


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
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="relative bg-dark py-20 lg:py-32 text-white overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="container-premium relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-blue-400 font-medium uppercase tracking-wider text-sm">About Us</span>
            <h1 className="text-h2 mb-6">Our Story</h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
              GrowthVerse is a digital technology and solutions company
              dedicated to helping businesses establish and improve their
              digital presence through modern technology and thoughtful design.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-h2">Company Introduction</h2>
              <p className="text-secondary-text dark:text-gray-300 text-lg leading-relaxed mb-6">
                GrowthVerse was founded with a simple mission: to help
                businesses, startups, and entrepreneurs build powerful digital
                experiences that drive growth. We combine technical expertise
                with creative design to deliver solutions that work.
              </p>
              <p className="text-secondary-text dark:text-gray-300 text-lg leading-relaxed mb-6">
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
            <div className="hidden lg:flex justify-center">
              <div className="w-full h-[400px] rounded-3xl border border-border dark:border-gray-700 bg-gray-50 dark:bg-dark-secondary p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10" />
                <div className="relative z-10">
                  <h4 className="font-semibold text-primary-text dark:text-white mb-4">Digital Technology & Solutions</h4>
                  <div className="space-y-4">
                    {[
                      "Modern web applications",
                      "Responsive user interfaces",
                      "Digital branding & design",
                      "AI and automation concepts",
                      "Cloud and DevOps solutions",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-secondary-text dark:text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
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

      <section className="section-padding bg-gray-50 dark:bg-dark-secondary">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Our Vision & Mission</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Guiding principles behind everything we build.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-3xl border border-border bg-white dark:bg-dark-secondary">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-3">Our Vision</h3>
              <p className="text-secondary-text dark:text-gray-300 leading-relaxed">
                To help businesses build, improve, and scale their digital
                presence through modern, responsive, and accessible frontend
                technology solutions.
              </p>
            </div>
            <div className="p-8 rounded-3xl border border-border bg-white dark:bg-dark-secondary">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-electric-blue mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-3">Our Mission</h3>
              <p className="text-secondary-text dark:text-gray-300 leading-relaxed">
                GrowthVerse delivers digital experiences that support business
                growth — from public-facing marketing websites to frontend
                dashboards that streamline business operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Core Values</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              What drives us forward.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Innovation", desc: "We embrace new technologies and creative approaches." },
              { title: "Reliability", desc: "We deliver on our promises with consistent quality." },
              { title: "Professionalism", desc: "We maintain high standards in every interaction." },
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl border border-border bg-white dark:bg-dark-secondary"
              >
                <h4 className="font-semibold text-primary-text dark:text-white mb-3">{value.title}</h4>
                <p className="text-secondary-text dark:text-gray-300 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-dark-secondary">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Our Team</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Placeholder team profiles until actual team information is provided.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl border border-border bg-white dark:bg-dark-secondary text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6 text-gray-500">
                  <span className="text-lg font-medium">{member.name.charAt(0)}</span>
                </div>
                <h4 className="font-semibold text-primary-text dark:text-white mb-1">{member.name}</h4>
                <p className="text-blue-600 dark:text-electric-blue text-sm font-medium mb-3">{member.role}</p>
                <p className="text-secondary-text dark:text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-secondary-text dark:text-gray-400 text-sm mt-8">
            Team profiles use placeholder labels. Actual team information will be added when available.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-blue-600 to-violet-600 text-white">
        <div className="container-premium">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h2 className="text-h2 mb-6">Ready to Build Something Great?</h2>
            <p className="text-blue-100 text-lg mb-10">
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
