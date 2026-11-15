import React from "react";
import { motion } from "framer-motion";
import { LuRocket, LuZap, LuShieldCheck, LuTarget, LuArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import { Navbar } from "../navigation/Navbar";
import { Footer } from "../navigation/Footer";

const FEATURES = [
  {
    icon: LuRocket,
    color: "text-blue-600",
    title: "Fast Delivery",
    description:
      "We build and launch your digital products quickly without compromising on quality.",
  },
  {
    icon: LuZap,
    color: "text-electric-blue",
    title: "Modern Technology",
    description:
      "We use React, Tailwind CSS, and modern tools to create performant applications.",
  },
  {
    icon: LuShieldCheck,
    color: "text-violet-600",
    title: "Quality Assured",
    description:
      "Every project goes through rigorous quality checks before delivery.",
  },
  {
    icon: LuTarget,
    color: "text-blue-600",
    title: "Business Focused",
    description:
      "Solutions designed around your business goals and growth objectives.",
  },
];

export function SectionHeader({ title, description, className = "" }) {
  return (
    <div className={`text-center mb-12 lg:mb-16 ${className}`}>
      <h2 className="text-h2 mb-4">{title}</h2>
      <p className="text-lg text-secondary-text max-w-2xl mx-auto">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Announcement Bar */}
      <div className="bg-blue-600 text-white text-xs font-medium px-4 py-2 text-center">
        New: Digital transformation services now available. Start your project today.
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -translate-y-1/2 animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        <div className="container-premium relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-electric-blue text-sm font-medium border border-blue-100 dark:border-blue-800/30"
              >
                <span>Build Digital. Grow Business.</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-h1 leading-tight"
              >
                Turn Ideas into <br />
                <span className="text-gradient">Powerful Digital Experiences</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-secondary-text dark:text-gray-300 max-w-lg leading-relaxed"
              >
                GrowthVerse helps businesses, startups, and entrepreneurs
                establish and improve their digital presence through modern
                technology, thoughtful design, and innovative solutions.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button variant="primary" size="lg" asChild>
                  <a href="/contact">Start Your Project</a>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <a href="/services">Explore Our Services</a>
                </Button>
              </motion.div>
            </div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative rounded-3xl border border-border bg-gray-50 dark:bg-dark-secondary shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10" />
                <div className="p-8 md:p-12 relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                      <LuRocket className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-text dark:text-white">Project Dashboard</h4>
                      <p className="text-xs text-secondary-text dark:text-gray-400">Live preview</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-secondary p-4" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="section-padding bg-gray-50 dark:bg-dark-secondary">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <SectionHeader
                title="About GrowthVerse"
                description="Helping businesses build their digital presence."
              />
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue">
                    <LuTarget className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-white">Who We Are</h4>
                    <p className="text-secondary-text dark:text-gray-300 text-sm">
                      A digital technology company focused on delivering modern web solutions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue">
                    <LuZap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-white">What We Do</h4>
                    <p className="text-secondary-text dark:text-gray-300 text-sm">
                      We build websites, web applications, and digital experiences that drive growth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue">
                    <LuShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-white">Who We Serve</h4>
                    <p className="text-secondary-text dark:text-gray-300 text-sm">
                      Startups, entrepreneurs, and growing businesses worldwide.
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="primary" asChild>
                <a href="/about">Discover GrowthVerse</a>
              </Button>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-full h-[400px] rounded-3xl border border-border bg-white dark:bg-dark-secondary p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-gradient-to-br from-blue-600 to-violet-600" />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-primary-text dark:text-white mb-4">Preview Dashboard</h3>
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {[
                      { label: "Overview", color: "blue" },
                      { label: "Services", color: "purple" },
                      { label: "Pricing", color: "green" },
                      { label: "Customers", color: "orange" },
                    ].map((item, idx) => (
                      <div key={idx} className={`rounded-xl p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3`}>
                        <div className={`w-8 h-8 rounded-full ${item.color === "blue" ? "bg-blue-100 text-blue-600" : item.color === "purple" ? "bg-purple-100 text-purple-600" : item.color === "green" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"} flex items-center justify-center`} />
                        <span className="text-sm font-medium text-primary-text dark:text-white">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding">
        <div className="container-premium">
          <SectionHeader title="Our Services" description="Explore our range of digital technology solutions." />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Website Development",
                desc: "Corporate websites, landing pages, and e-commerce frontend experiences.",
                icon: "Monitor",
              },
              {
                title: "Web Applications",
                desc: "Custom dashboards, admin interfaces, and SaaS frontend experiences.",
                icon: "Code",
              },
              {
                title: "UI/UX Design",
                desc: "User research, wireframing, prototyping, and interface design.",
                icon: "Palette",
              },
            ].map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-premium hover:border-blue-600 dark:hover:border-blue-800/50"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-blue-600 mb-6 group-hover:text-electric-blue transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-primary-text dark:text-white mb-3">{service.title}</h4>
                <p className="text-secondary-text dark:text-gray-300 text-sm">{service.desc}</p>
                <a
                  href="/services"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-electric-blue hover:gap-2 transition-colors"
                >
                  Learn More <LuArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white dark:bg-dark-secondary">
        <div className="container-premium">
          <SectionHeader title="Why Choose GrowthVerse" description="We deliver digital solutions that create real business value." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl border border-border bg-gray-50 dark:bg-dark-secondary hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color} bg-opacity-10`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h4 className="font-semibold text-primary-text dark:text-white mb-3">{feature.title}</h4>
                <p className="text-secondary-text dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-br from-blue-600 to-violet-600 text-white">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center py-16">
            <h2 className="text-h2 mb-6">Ready to Build Something Great?</h2>
            <p className="text-blue-100 text-lg mb-10">
              Let's create your digital presence together. Reach out to us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="white" size="lg" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
              <Button variant="ghost" size="lg" className="border-white/20 text-white hover:bg-white/10" asChild>
                <a href="/services">View Services</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
