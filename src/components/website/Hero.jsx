import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import { Navbar } from "../navigation/Navbar";

const WHY_FEATURES = [
  {
    title: "Fast Delivery",
    description:
      "We build and launch your digital products quickly without compromising on quality.",
  },
  {
    title: "Modern Technology",
    description:
      "We use React, Tailwind CSS, and modern tools to create performant applications.",
  },
  {
    title: "Quality Assured",
    description:
      "Every project goes through rigorous quality checks before delivery.",
  },
  {
    title: "Business Focused",
    description:
      "Solutions designed around your business goals and growth objectives.",
  },
];

export function SectionHeader({ title, description, className = "" }) {
  return (
    <div className={`text-center mb-16 lg:mb-20 ${className}`}>
      <span className="badge-accent mb-4 block">{title.split(" ").slice(0, 2).join(" ")}</span>
      <h2 className="text-h2 mb-6">{title}</h2>
      <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      {/* Announcement Bar */}
      <div className="bg-forest text-white text-xs font-medium px-4 py-2 text-center">
        New: Digital transformation services now available. Start your project today.
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container-premium relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-light text-forest-dark text-sm font-medium border border-forest/20"
              >
                <span>Build Digital. Grow Business.</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-h1 leading-tight"
              >
                Digital solutions that <br />
                <span className="text-charcoal font-display">help your business grow.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted max-w-lg leading-relaxed"
              >
                GrowthVerse helps businesses, startups, and entrepreneurs
                establish and improve their digital presence through
                technology, development, and design.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button variant="primary" size="lg" asChild>
                  <a href="/contact">Start a Project</a>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <a href="/services">Explore Services</a>
                </Button>
              </motion.div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-full h-[400px] rounded-xl border border-border bg-white dark:bg-dark-surface p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-forest/5" />
                <div className="relative z-10">
                  <h4 className="font-semibold text-charcoal dark:text-white mb-4">Dashboard Preview</h4>
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {[
                      { label: "Overview" },
                      { label: "Services" },
                      { label: "Pricing" },
                      { label: "Customers" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg p-4 border border-border bg-white dark:bg-dark-surface flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-forest-light flex items-center justify-center text-forest-dark">
                          <span className="text-[10px] font-bold">{item.label.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium text-charcoal dark:text-white">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="section-padding bg-white dark:bg-charcoal-dark">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <SectionHeader title="About GrowthVerse" description="Helping businesses build their digital presence." />
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark">
                    <span className="text-[14px]">●</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white">Who We Are</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
                      A digital technology company focused on delivering modern web solutions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark">
                    <span className="text-[14px]">●</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white">What We Do</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
                      We build websites, web applications, and digital experiences that drive growth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark">
                    <span className="text-[14px]">●</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white">Who We Serve</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
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
              <div className="w-full h-[400px] rounded-xl border border-border bg-charcoal-dark p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-forest/10" />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white mb-4">Dashboard Preview</h3>
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {[
                      { label: "Overview" },
                      { label: "Services" },
                      { label: "Pricing" },
                      { label: "Customers" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg p-4 border border-dark-border bg-charcoal flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-forest/20 flex items-center justify-center text-forest-light">
                          <span className="text-[10px] font-bold">{item.label.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{item.label}</span>
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
      <section className="section-padding bg-ivory">
        <div className="container-premium">
          <SectionHeader title="Our Services" description="Explore our range of digital technology solutions." />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Website Development",
                desc: "Corporate websites, landing pages, and e-commerce frontend experiences.",
              },
              {
                title: "Web Applications",
                desc: "Custom dashboards, admin interfaces, and SaaS frontend experiences.",
              },
              {
                title: "UI/UX Design",
                desc: "User research, wireframing, prototyping, and interface design.",
              },
            ].map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="card-premium hover:border-forest/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-forest-light text-forest-dark">
                  <span className="text-[18px]">●</span>
                </div>
                <h4 className="font-semibold text-charcoal dark:text-white mb-3">
                  {service.title}
                </h4>
                <p className="text-muted dark:text-gray-400 text-sm leading-relaxed mb-6">
                  {service.desc}
                </p>
                <a
                  href="/services"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-charcoal dark:text-white hover:gap-2 transition-colors"
                >
                  Learn More <ArrowRight className="h-3 w-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white dark:bg-charcoal-dark">
        <div className="container-premium">
          <SectionHeader title="Why Choose GrowthVerse" description="We deliver digital solutions that create real business value." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-xl border border-border bg-charcoal-dark dark:bg-charcoal-dark hover:shadow-lg transition-all duration-300"
              >
                <h4 className="font-semibold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-charcoal-dark text-white">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center py-16">
            <h2 className="text-h2 mb-6">Ready to Build Something Great?</h2>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              Let's create your digital presence together. Reach out to us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
              <Button variant="ghost" size="lg" className="border-white/20 text-white hover:bg-white/10" asChild>
                <a href="/services">View Services</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
