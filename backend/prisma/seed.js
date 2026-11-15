// GrowthVerse Backend Seed Script
// Seeds demonstration data into PostgreSQL database
// Data is explicitly marked as demonstration content

import prisma from "../src/lib/prisma.js";

console.log("🌱 Running GrowthVerse backend seed script...\n");

// Seed Services
async function seedServices() {
  console.log("Seeding services...");

  const services = [
    {
      title: "Website Development",
      slug: "website-development",
      category: "Web Development",
      shortDescription:
        "Corporate websites, landing pages, and e-commerce frontend experiences.",
      description:
        "Professional business websites, corporate websites, landing pages, and e-commerce frontend experiences that help you establish a powerful digital presence.",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "CMS Integration", "Cross-browser Compatible"],
      isActive: true,
      displayOrder: 1,
    },
    {
      title: "Web Application Development",
      slug: "web-application-development",
      category: "Web Development",
      shortDescription:
        "Custom web applications, dashboards, and admin interfaces.",
      description:
        "Custom web applications, business dashboards, admin interfaces, and interactive SaaS frontend experiences built with modern React architecture.",
      features: ["Custom Dashboards", "Admin Interfaces", "Real-time UI", "API Integration", "User Authentication UI"],
      isActive: true,
      displayOrder: 2,
    },
    {
      title: "UI/UX Design",
      slug: "ui-ux-design",
      category: "Design",
      shortDescription:
        "User research, wireframing, prototyping, and interface design.",
      description:
        "User research, wireframing, prototyping, interface design, and design systems that create intuitive, accessible, and beautiful user experiences.",
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
      isActive: true,
      displayOrder: 3,
    },
    {
      title: "Mobile Application Development",
      slug: "mobile-application-development",
      category: "Mobile",
      shortDescription:
        "iOS and Android mobile application development services.",
      description:
        "Mobile application development services for iOS and Android platforms, creating native-like experiences for your business on mobile devices.",
      features: ["iOS Development", "Android Development", "Cross-platform", "App Store Deployment", "Mobile UI Design"],
      isActive: true,
      displayOrder: 4,
    },
    {
      title: "AI and Automation",
      slug: "ai-and-automation",
      category: "AI & Automation",
      shortDescription:
        "AI integration solutions and workflow automation.",
      description:
        "AI integration solutions, workflow automation, AI-powered interfaces, and business automation concepts that help you work smarter, not harder.",
      features: ["AI Integration", "Workflow Automation", "Smart Interfaces", "Business Automation", "Chatbot Development"],
      isActive: true,
      displayOrder: 5,
    },
    {
      title: "Cloud and DevOps",
      slug: "cloud-and-devops",
      category: "Cloud & DevOps",
      shortDescription:
        "Cloud infrastructure, deployment, and DevOps automation.",
      description:
        "Cloud infrastructure solutions, deployment support, CI/CD, containerization, and infrastructure automation for scalable business operations.",
      features: ["Cloud Infrastructure", "CI/CD Pipelines", "Containerization", "Infrastructure Automation", "Deployment Support"],
      isActive: true,
      displayOrder: 6,
    },
    {
      title: "Digital Branding",
      slug: "digital-branding",
      category: "Branding",
      shortDescription:
        "Brand identity, visual direction, and brand assets.",
      description:
        "Brand identity, visual direction, brand assets, and digital presentation services that help you stand out in the digital marketplace.",
      features: ["Brand Identity", "Visual Direction", "Brand Assets", "Digital Presentation", "Brand Guidelines"],
      isActive: true,
      displayOrder: 7,
    },
    {
      title: "Digital Marketing",
      slug: "digital-marketing",
      category: "Marketing",
      shortDescription:
        "Digital presence, marketing strategy, and campaign concepts.",
      description:
        "Digital presence, marketing strategy, campaign concepts, and content strategy to help your business grow online.",
      features: ["Marketing Strategy", "Campaign Concepts", "Content Strategy", "Digital Growth", "Social Media Strategy"],
      isActive: true,
      displayOrder: 8,
    },
    {
      title: "Sarthi - School Management Solution",
      slug: "sarthi",
      category: "Education Technology",
      shortDescription:
        "School management solution for educational institutions.",
      description:
        "A school management solution presented as a GrowthVerse service offering. Sarthi helps educational institutions manage their operations through digital tools.",
      features: ["Student Management", "Attendance Tracking", "Academic Management", "Fee Management", "Parent Communication"],
      isActive: true,
      displayOrder: 9,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log(`  ✅ ${services.length} services seeded`);
}

// Seed Pricing Plans
async function seedPricingPlans() {
  console.log("Seeding pricing plans...");

  const pricingPlans = [
    // Indian one-time project development pricing
    {
      name: "Website Development - One-time",
      category: "Project Development",
      audience: "indian",
      billingCycle: "one-time",
      currency: "INR",
      amount: 5000, // midpoint of ₹4,000-₹6,000
      description: "Website development project cost for Indian customers",
      features: ["Responsive design", "CMS integration", "Deployment assistance", "3 months free support"],
      isActive: true,
      displayOrder: 1,
    },
    // International one-time project development pricing
    {
      name: "Website Development - One-time",
      category: "Project Development",
      audience: "international",
      billingCycle: "one-time",
      currency: "USD",
      amount: 1250, // midpoint of $1,000-$1,500
      description: "Website development project cost for international customers",
      features: ["Responsive design", "CMS integration", "Deployment assistance", "3 months free support"],
      isActive: true,
      displayOrder: 2,
    },
    // Indian monthly maintenance
    {
      name: "Monthly Maintenance",
      category: "Maintenance",
      audience: "indian",
      billingCycle: "monthly",
      currency: "INR",
      amount: 1000,
      description: "Monthly recurring maintenance plan (India)",
      features: ["Website maintenance", "Technical support", "Minor modifications"],
      isActive: true,
      displayOrder: 3,
    },
    {
      name: "Quarterly Maintenance",
      category: "Maintenance",
      audience: "indian",
      billingCycle: "quarterly",
      currency: "INR",
      amount: 4000,
      description: "Quarterly recurring maintenance plan (India)",
      features: ["Website maintenance", "Technical support", "Minor modifications"],
      isActive: true,
      displayOrder: 4,
    },
    {
      name: "Yearly Maintenance",
      category: "Maintenance",
      audience: "indian",
      billingCycle: "yearly",
      currency: "INR",
      amount: 11000,
      description: "Yearly recurring maintenance plan (India)",
      features: ["Website maintenance", "Technical support", "Minor modifications"],
      isActive: true,
      displayOrder: 5,
    },
    // International monthly maintenance
    {
      name: "Monthly Maintenance",
      category: "Maintenance",
      audience: "international",
      billingCycle: "monthly",
      currency: "USD",
      amount: 300,
      description: "Monthly recurring maintenance plan (International)",
      features: ["Website maintenance", "Technical support", "Minor modifications"],
      isActive: true,
      displayOrder: 6,
    },
    {
      name: "Quarterly Maintenance",
      category: "Maintenance",
      audience: "international",
      billingCycle: "quarterly",
      currency: "USD",
      amount: 1200,
      description: "Quarterly recurring maintenance plan (International)",
      features: ["Website maintenance", "Technical support", "Minor modifications"],
      isActive: true,
      displayOrder: 7,
    },
    {
      name: "Yearly Maintenance",
      category: "Maintenance",
      audience: "international",
      billingCycle: "yearly",
      currency: "USD",
      amount: 2200,
      description: "Yearly recurring maintenance plan (International)",
      features: ["Website maintenance", "Technical support", "Minor modifications"],
      isActive: true,
      displayOrder: 8,
    },
  ];

  for (const plan of pricingPlans) {
    await prisma.pricingPlan.upsert({
      where: {
        name_category_audience_billingCycle: {
          name: plan.name,
          category: plan.category,
          audience: plan.audience,
          billingCycle: plan.billingCycle,
        },
      },
      update: plan,
      create: plan,
    });
  }

  console.log(`  ✅ ${pricingPlans.length} pricing plans seeded`);
}

// Seed Features
async function seedFeatures() {
  console.log("Seeding features...");

  const features = [
    {
      title: "Business-First Approach",
      category: "Strategy",
      description:
        "Every solution we build starts with your business goals, not just technology.",
      icon: "Target",
      isActive: true,
      displayOrder: 1,
    },
    {
      title: "Modern UI/UX",
      category: "Design",
      description:
        "Contemporary interfaces that users love, with accessibility and usability at the core.",
      icon: "Palette",
      isActive: true,
      displayOrder: 2,
    },
    {
      title: "Responsive Design",
      category: "Development",
      description:
        "Seamless experiences across desktop, tablet, and mobile devices.",
      icon: "Monitor",
      isActive: true,
      displayOrder: 3,
    },
    {
      title: "Scalable Architecture",
      category: "Technology",
      description:
        "Built to grow with your business, from startup to enterprise.",
      icon: "Layers",
      isActive: true,
      displayOrder: 4,
    },
    {
      title: "Technology-Focused",
      category: "Innovation",
      description:
        "Modern stacks including React, Tailwind, and AI integration capabilities.",
      icon: "Code",
      isActive: true,
      displayOrder: 5,
    },
    {
      title: "Transparent Collaboration",
      category: "Process",
      description:
        "Clear communication and regular progress updates throughout your project.",
      icon: "Share2",
      isActive: true,
      displayOrder: 6,
    },
  ];

  for (const feature of features) {
    const existing = await prisma.feature.findFirst({ where: { title: feature.title } });
    if (existing) {
      await prisma.feature.update({ where: { id: existing.id }, data: feature });
    } else {
      await prisma.feature.create({ data: feature });
    }
  }

  console.log(`  ✅ ${features.length} features seeded`);
}

// Seed Portfolio Projects (demonstration content)
async function seedPortfolio() {
  console.log("Seeding portfolio projects...");

  const projects = [
    {
      title: "E-Commerce Platform for Luna Boutique",
      slug: "ecommerce-luna-boutique",
      category: "Websites",
      description:
        "A complete e-commerce frontend experience for Luna Boutique, featuring product catalog, shopping cart, and checkout flow with responsive design.",
      technologies: ["React", "Tailwind CSS", "JavaScript"],
      thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      ],
      projectUrl: "https://example.com",
      isPublished: true,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      title: "FinTech Dashboard for Nova Bank",
      slug: "fintech-dashboard-nova-bank",
      category: "Web Applications",
      description:
        "Business dashboard for Nova Bank with transaction analytics, account management, and real-time data visualization.",
      technologies: ["React", "Recharts", "Tailwind CSS"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      ],
      projectUrl: "https://example.com",
      isPublished: true,
      isFeatured: false,
      displayOrder: 2,
    },
    {
      title: "Brand Identity for Apex Fitness",
      slug: "brand-identity-apex-fitness",
      category: "Branding",
      description:
        "Complete brand identity system including logo, color palette, typography, and brand guidelines for Apex Fitness.",
      technologies: ["Figma", "Illustrator", "Brand Strategy"],
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      ],
      projectUrl: "https://example.com",
      isPublished: true,
      isFeatured: false,
      displayOrder: 3,
    },
  ];

  for (const project of projects) {
    await prisma.portfolioProject.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log(`  ✅ ${projects.length} portfolio projects seeded`);
}

// Seed Site Settings
async function seedSettings() {
  console.log("Seeding site settings...");

  const settings = [
    { key: "company_name", value: "GrowthVerse" },
    { key: "tagline", value: "Build Digital. Grow Business." },
    { key: "description", value: "A modern digital technology and solutions company helping businesses establish and improve their digital presence." },
    { key: "contact_email", value: "contact@growthverse.com" },
    { key: "contact_phone", value: "+1 (555) 123-4567" },
    { key: "business_address", value: "123 Digital Way, Tech City" },
    { key: "social_github", value: "https://github.com/Aashu31/Growthverse" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log(`  ✅ ${settings.length} settings seeded`);
}

// Main seed function
async function main() {
  await seedServices();
  await seedPricingPlans();
  await seedFeatures();
  await seedPortfolio();
  await seedSettings();

  console.log("\n✅ Seed script completed.");
  console.log("📝 All seed data is explicitly marked as demonstration content.");
  console.log("   Do not use for production purposes without verification.");
}

// Run the seed script
main()
  .catch((e) => {
    console.error("❌ Seed script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });