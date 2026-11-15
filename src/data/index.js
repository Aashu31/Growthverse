export const SERVICES_DATA = [
  {
    id: "svc-001",
    name: "Website Development",
    slug: "website-development",
    category: "Web Development",
    description:
      "Professional business websites, corporate websites, landing pages, and e-commerce frontend experiences that help you establish a powerful digital presence.",
    shortDescription:
      "Corporate websites, landing pages, and e-commerce frontend experiences.",
    features: [
      "Responsive Design",
      "SEO Optimized",
      "Fast Loading",
      "CMS Integration",
      "Cross-browser Compatible",
    ],
    icon: "Monitor",
    iconColor: "text-blue-600",
    status: "active",
    timeline: "2-6 weeks",
    createdDate: new Date().toISOString(),
  },
  {
    id: "svc-002",
    name: "Web Application Development",
    slug: "web-application-development",
    category: "Web Development",
    description:
      "Custom web applications, business dashboards, admin interfaces, and interactive SaaS frontend experiences built with modern React architecture.",
    shortDescription:
      "Custom web applications, dashboards, and admin interfaces.",
    features: [
      "Custom Dashboards",
      "Admin Interfaces",
      "Real-time UI",
      "API Integration",
      "User Authentication UI",
    ],
    icon: "Code",
    iconColor: "text-electric-blue",
    status: "active",
    timeline: "6-12 weeks",
    createdDate: new Date().toISOString(),
  },
  {
    id: "svc-003",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    category: "Design",
    description:
      "User research, wireframing, prototyping, interface design, and design systems that create intuitive, accessible, and beautiful user experiences.",
    shortDescription:
      "User research, wireframing, prototyping, and interface design.",
    features: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
    ],
    icon: "Layout",
    iconColor: "text-violet-600",
    status: "active",
    timeline: "1-4 weeks",
    createdDate: new Date().toISOString(),
  },
  {
    id: "svc-004",
    name: "Mobile Application Development",
    slug: "mobile-application-development",
    category: "Mobile",
    description:
      "Mobile application development services for iOS and Android platforms, creating native-like experiences for your business on mobile devices.",
    shortDescription:
      "iOS and Android mobile application development services.",
    features: [
      "iOS Development",
      "Android Development",
      "Cross-platform",
      "App Store Deployment",
      "Mobile UI Design",
    ],
    icon: "Smartphone",
    iconColor: "text-blue-600",
    status: "active",
    timeline: "8-16 weeks",
    createdDate: new Date().toISOString(),
  },
  {
    id: "svc-005",
    name: "AI and Automation",
    slug: "ai-and-automation",
    category: "AI & Automation",
    description:
      "AI integration solutions, workflow automation, AI-powered interfaces, and business automation concepts that help you work smarter, not harder.",
    shortDescription:
      "AI integration solutions and workflow automation.",
    features: [
      "AI Integration",
      "Workflow Automation",
      "Smart Interfaces",
      "Business Automation",
      "Chatbot Development",
    ],
    icon: "Brain",
    iconColor: "text-electric-blue",
    status: "active",
    timeline: "4-8 weeks",
    createdDate: new Date().toISOString(),
  },
  {
    id: "svc-006",
    name: "Cloud and DevOps",
    slug: "cloud-and-devops",
    category: "Cloud & DevOps",
    description:
      "Cloud infrastructure solutions, deployment support, CI/CD, containerization, and infrastructure automation for scalable business operations.",
    shortDescription:
      "Cloud infrastructure, deployment, and DevOps automation.",
    features: [
      "Cloud Infrastructure",
      "CI/CD Pipelines",
      "Containerization",
      "Infrastructure Automation",
      "Deployment Support",
    ],
    icon: "Cloud",
    iconColor: "text-blue-600",
    status: "active",
    timeline: "3-8 weeks",
    createdDate: new Date().toISOString(),
  },
  {
    id: "svc-007",
    name: "Digital Branding",
    slug: "digital-branding",
    category: "Branding",
    description:
      "Brand identity, visual direction, brand assets, and digital presentation services that help you stand out in the digital marketplace.",
    shortDescription:
      "Brand identity, visual direction, and brand assets.",
    features: [
      "Brand Identity",
      "Visual Direction",
      "Brand Assets",
      "Digital Presentation",
      "Brand Guidelines",
    ],
    icon: "Palette",
    iconColor: "text-violet-600",
    status: "active",
    timeline: "2-5 weeks",
    createdDate: new Date().toISOString(),
  },
  {
    id: "svc-008",
    name: "Digital Marketing",
    slug: "digital-marketing",
    category: "Marketing",
    description:
      "Digital presence, marketing strategy, campaign concepts, and content strategy to help your business grow online.",
    shortDescription:
      "Digital presence, marketing strategy, and campaign concepts.",
    features: [
      "Marketing Strategy",
      "Campaign Concepts",
      "Content Strategy",
      "Digital Growth",
      "Social Media Strategy",
    ],
    icon: "Megaphone",
    iconColor: "text-blue-600",
    status: "active",
    timeline: "1-6 weeks",
    createdDate: new Date().toISOString(),
  },
  {
    id: "svc-009",
    name: "Sarthi - School Management Solution",
    slug: "sarthi",
    category: "Education Technology",
    description:
      "A school management solution presented as a GrowthVerse service offering. Sarthi helps educational institutions manage their operations through digital tools.",
    shortDescription:
      "School management solution for educational institutions.",
    features: [
      "Student Management",
      "Attendance Tracking",
      "Academic Management",
      "Fee Management",
      "Parent Communication",
    ],
    icon: "GraduationCap",
    iconColor: "text-violet-600",
    status: "active",
    timeline: "Custom",
    createdDate: new Date().toISOString(),
  },
];

export const CATEGORIES = [
  "Web Development",
  "Design",
  "Mobile",
  "AI & Automation",
  "Cloud & DevOps",
  "Branding",
  "Marketing",
  "Education Technology",
];

export const TECHNOLOGIES_DATA = {
  frontend: [
    { name: "React.js", description: "Component-based UI library" },
    { name: "JavaScript ES6+", description: "Modern application language" },
    { name: "HTML5", description: "Semantic markup structure" },
    { name: "CSS3", description: "Styling and layout" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework" },
  ],
  backend: [
    { name: "Node.js", description: "Server-side JavaScript runtime" },
    { name: "Express", description: "Web application framework" },
    { name: "Fastify", description: "High-performance web framework" },
  ],
  languages: [
    { name: "JavaScript", description: "Primary programming language" },
    { name: "TypeScript", description: "Typed JavaScript (planned)" },
    { name: "Python", description: "AI and automation scripts" },
  ],
  cloud: [
    { name: "AWS", description: "Cloud infrastructure platform" },
    { name: "Vercel", description: "Frontend deployment platform" },
    { name: "Netlify", description: "Web hosting and deployment" },
  ],
  devops: [
    { name: "CI/CD", description: "Continuous integration and deployment" },
    { name: "Docker", description: "Containerization platform" },
    { name: "GitHub Actions", description: "Automation platform" },
  ],
  databases: [
    { name: "PostgreSQL", description: "Relational database" },
    { name: "MongoDB", description: "Document database" },
    { name: "Redis", description: "In-memory data store" },
  ],
  ai: [
    { name: "OpenAI API", description: "AI integration" },
    { name: "Machine Learning", description: "ML model integration" },
    { name: "Workflow Automation", description: "Business process automation" },
  ],
  design: [
    { name: "Figma", description: "UI/UX design tool" },
    { name: "Adobe XD", description: "Design and prototyping" },
    { name: "Illustrator", description: "Vector graphics" },
  ],
};

export const PORTFOLIO_DATA = [];

export const PRICING_DATA = [
  {
    id: "plan-001",
    name: "Starter",
    description:
      "Perfect for small businesses and individuals getting started online.",
    price: 49,
    currency: "USD",
    billingType: "month",
    features: [
      "1 Website",
      "Basic SEO",
      "Email Support",
      "Up to 5 Pages",
      "Contact Form",
    ],
    limitations: [
      "Limited customization",
      "No e-commerce",
      "Community support",
    ],
    popular: false,
    active: true,
  },
  {
    id: "plan-002",
    name: "Professional",
    description:
      "Ideal for growing businesses that need more power and flexibility.",
    price: 149,
    currency: "USD",
    billingType: "month",
    features: [
      "5 Websites",
      "Advanced SEO",
      "Priority Support",
      "Unlimited Pages",
      "E-commerce Ready",
      "Analytics",
    ],
    limitations: [
      "No custom domain management",
      "Standard analytics",
    ],
    popular: true,
    active: true,
  },
  {
    id: "plan-003",
    name: "Business",
    description:
      "For businesses requiring broader digital solutions and dedicated support.",
    price: 299,
    currency: "USD",
    billingType: "month",
    features: [
      "20 Websites",
      "White-label Solutions",
      "24/7 Support",
      "Custom Integrations",
      "Advanced Analytics",
      "Dedicated Account Manager",
    ],
    limitations: [
      "Custom contract required",
      "Setup fee applies",
    ],
    popular: false,
    active: true,
  },
  {
    id: "plan-004",
    name: "Enterprise / Custom",
    description:
      "Customized digital solutions for enterprise-level business requirements.",
    price: 0,
    currency: "USD",
    billingType: "custom",
    features: [
      "Unlimited Everything",
      "Custom Development",
      "Dedicated Team",
      "SLA Guarantee",
      "On-premise Options",
    ],
    limitations: [
      "Custom pricing",
      "Longer setup time",
    ],
    popular: false,
    active: true,
  },
];

export const FEATURES_DATA = [
  {
    id: "feat-001",
    name: "Business-First Approach",
    category: "Strategy",
    description:
      "Every solution we build starts with your business goals, not just technology.",
    icon: "Target",
    visible: true,
  },
  {
    id: "feat-002",
    name: "Modern UI/UX",
    category: "Design",
    description:
      "Contemporary interfaces that users love, with accessibility and usability at the core.",
    icon: "Palette",
    visible: true,
  },
  {
    id: "feat-003",
    name: "Responsive Design",
    category: "Development",
    description:
      "Seamless experiences across desktop, tablet, and mobile devices.",
    icon: "Monitor",
    visible: true,
  },
  {
    id: "feat-004",
    name: "Scalable Architecture",
    category: "Technology",
    description:
      "Built to grow with your business, from startup to enterprise.",
    icon: "Layers",
    visible: true,
  },
  {
    id: "feat-005",
    name: "Technology-Focused",
    category: "Innovation",
    description:
      "Modern stacks including React, Tailwind, and AI integration capabilities.",
    icon: "Code",
    visible: true,
  },
  {
    id: "feat-006",
    name: "Transparent Collaboration",
    category: "Process",
    description:
      "Clear communication and regular progress updates throughout your project.",
    icon: "Share2",
    visible: true,
  },
];

export const DASHBOARD_STATS = [
  {
    label: "Total Customers",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: "Users",
    iconColor: "text-blue-600",
  },
  {
    label: "Total Orders",
    value: "456",
    change: "+8%",
    changeType: "positive",
    icon: "ShoppingCart",
    iconColor: "text-electric-blue",
  },
  {
    label: "Active Services",
    value: "8",
    change: "+2",
    changeType: "positive",
    icon: "Code",
    iconColor: "text-violet-600",
  },
  {
    label: "Pending Enquiries",
    value: "23",
    change: "-5%",
    changeType: "negative",
    icon: "Mail",
    iconColor: "text-orange-500",
  },
  {
    label: "Demo Revenue",
    value: "$84,500",
    change: "+18%",
    changeType: "positive",
    icon: "DollarSign",
    iconColor: "text-green-600",
  },
];

export const COMPANY_DATA = {
  name: "GrowthVerse",
  tagline: "Build Digital. Grow Business.",
  description:
    "A modern digital technology and solutions company helping businesses establish and improve their digital presence through modern technology and digital solutions.",
  website: "https://github.com/Aashu31/Growthverse",
  socialMedia: {
    github: "https://github.com/Aashu31/Growthverse",
  },
};

export const FAQS_DATA = [
  {
    question: "What services does GrowthVerse offer?",
    answer:
      "GrowthVerse offers website development, web application development, UI/UX design, mobile application development, AI and automation, cloud and DevOps, digital branding, and digital marketing services.",
  },
  {
    question: "Is GrowthVerse a full-stack platform?",
    answer:
      "No. GrowthVerse V1 is a frontend-only project. There is no backend, database, or server-side processing.",
  },
  {
    question: "Are the prices shown real?",
    answer:
      "No. Pricing amounts are demonstration values until actual company pricing is supplied.",
  },
  {
    question: "What is Sarthi?",
    answer:
      "Sarthi is a School Management Solution presented as a service under GrowthVerse. It is a marketing presentation only; its software is not developed.",
  },
  {
    question: "Does the dashboard save data?",
    answer:
      "Dashboard data is stored in browser LocalStorage for demonstration purposes. It is not synchronized to a server.",
  },
  {
    question: "Is authentication secure?",
    answer:
      "No. Login and signup are frontend demonstrations only. There is no secure authentication backend.",
  },
];
