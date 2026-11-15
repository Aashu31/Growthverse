import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [demoData, setDemoData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("growthverse-demo-data");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return getInitialData();
        }
      }
    }
    return getInitialData();
  });

  useEffect(() => {
    localStorage.setItem("growthverse-demo-data", JSON.stringify(demoData));
  }, [demoData]);

  const resetDemoData = useCallback(() => {
    setDemoData(getInitialData());
  }, []);

  const updateEntity = useCallback((entityType, id, updates) => {
    setDemoData((prev) => {
      const entityIndex = prev[entityType].findIndex((item) => item.id === id);
      if (entityIndex === -1) return prev;
      const newEntities = [...prev[entityType]];
      newEntities[entityIndex] = { ...newEntities[entityIndex], ...updates };
      return { ...prev, [entityType]: newEntities };
    });
  }, []);

  const createEntity = useCallback((entityType, newItem) => {
    setDemoData((prev) => ({
      ...prev,
      [entityType]: [...prev[entityType], newItem],
    }));
  }, []);

  const deleteEntity = useCallback((entityType, id) => {
    setDemoData((prev) => ({
      ...prev,
      [entityType]: prev[entityType].filter((item) => item.id !== id),
    }));
  }, []);

  const contextValue = {
    demoData,
    setDemoData,
    updateEntity,
    createEntity,
    deleteEntity,
    resetDemoData,
    isDemo: true,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

const getInitialData = () => ({
  services: [
    {
      id: "svc-001",
      name: "Website Development",
      slug: "website-development",
      category: "Web Development",
      description:
        "Professional business websites, corporate websites, landing pages, and e-commerce frontend experiences that help you establish a powerful digital presence.",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "CMS Integration"],
      icon: "Monitor",
      status: "active",
      createdDate: new Date().toISOString(),
    },
    {
      id: "svc-002",
      name: "Web Application Development",
      slug: "web-application-development",
      category: "Web Development",
      description:
        "Custom web applications, business dashboards, admin interfaces, and interactive SaaS frontend experiences built with modern React architecture.",
      features: ["Custom Dashboards", "Admin Interfaces", "Real-time UI", "API Integration"],
      icon: "Code",
      status: "active",
      createdDate: new Date().toISOString(),
    },
    {
      id: "svc-003",
      name: "UI/UX Design",
      slug: "ui-ux-design",
      category: "Design",
      description:
        "User research, wireframing, prototyping, interface design, and design systems that create intuitive, accessible, and beautiful user experiences.",
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      icon: "Layout",
      status: "active",
      createdDate: new Date().toISOString(),
    },
    {
      id: "svc-004",
      name: "Mobile Application Development",
      slug: "mobile-application-development",
      category: "Mobile",
      description:
        "Mobile application development services for iOS and Android platforms, creating native-like experiences for your business on mobile devices.",
      features: ["iOS Development", "Android Development", "Cross-platform", "App Store Deployment"],
      icon: "Smartphone",
      status: "active",
      createdDate: new Date().toISOString(),
    },
    {
      id: "svc-005",
      name: "AI and Automation",
      slug: "ai-and-automation",
      category: "AI & Automation",
      description:
        "AI integration solutions, workflow automation, AI-powered interfaces, and business automation concepts that help you work smarter, not harder.",
      features: ["AI Integration", "Workflow Automation", "Smart Interfaces", "Business Automation"],
      icon: "Brain",
      status: "active",
      createdDate: new Date().toISOString(),
    },
    {
      id: "svc-006",
      name: "Cloud and DevOps",
      slug: "cloud-and-devops",
      category: "Cloud & DevOps",
      description:
        "Cloud infrastructure solutions, deployment support, CI/CD, containerization, and infrastructure automation for scalable business operations.",
      features: ["Cloud Infrastructure", "CI/CD", "Containerization", "DevOps Automation"],
      icon: "Cloud",
      status: "active",
      createdDate: new Date().toISOString(),
    },
    {
      id: "svc-007",
      name: "Digital Branding",
      slug: "digital-branding",
      category: "Branding",
      description:
        "Brand identity, visual direction, brand assets, and digital presentation services that help you stand out in the digital marketplace.",
      features: ["Brand Identity", "Visual Direction", "Brand Assets", "Digital Presentation"],
      icon: "Palette",
      status: "active",
      createdDate: new Date().toISOString(),
    },
    {
      id: "svc-008",
      name: "Digital Marketing",
      slug: "digital-marketing",
      category: "Marketing",
      description:
        "Digital presence, marketing strategy, campaign concepts, and content strategy to help your business grow online.",
      features: ["Marketing Strategy", "Campaign Concepts", "Content Strategy", "Digital Growth"],
      icon: "Megaphone",
      status: "active",
      createdDate: new Date().toISOString(),
    },
  ],
  pricing: [
    {
      id: "plan-001",
      name: "Starter",
      description: "Perfect for small businesses and individuals getting started online.",
      price: 49,
      currency: "USD",
      billingType: "month",
      features: ["1 Website", "Basic SEO", "Email Support", "Up to 5 Pages", "Contact Form"],
      limitations: ["Limited customization", "No e-commerce", "Community support"],
      popular: false,
      active: true,
    },
    {
      id: "plan-002",
      name: "Professional",
      description: "Ideal for growing businesses that need more power and flexibility.",
      price: 149,
      currency: "USD",
      billingType: "month",
      features: ["5 Websites", "Advanced SEO", "Priority Support", "Unlimited Pages", "E-commerce Ready", "Analytics"],
      limitations: ["No custom domain management", "Standard analytics"],
      popular: true,
      active: true,
    },
    {
      id: "plan-003",
      name: "Business",
      description: "For businesses requiring broader digital solutions and dedicated support.",
      price: 299,
      currency: "USD",
      billingType: "month",
      features: ["20 Websites", "White-label Solutions", "24/7 Support", "Custom Integrations", "Advanced Analytics", "Dedicated Account Manager"],
      limitations: ["Custom contract required", "Setup fee applies"],
      popular: false,
      active: true,
    },
    {
      id: "plan-004",
      name: "Enterprise / Custom",
      description: "Customized digital solutions for enterprise-level business requirements.",
      price: 0,
      currency: "USD",
      billingType: "custom",
      features: ["Unlimited Everything", "Custom Development", "Dedicated Team", "SLA Guarantee", "On-premise Options", "Priority Everything"],
      limitations: ["Custom pricing", "Longer setup time"],
      popular: false,
      active: true,
    },
  ],
  features: [
    {
      id: "feat-001",
      name: "Business-First Approach",
      category: "Strategy",
      description: "Every solution we build starts with your business goals, not just technology.",
      icon: "Target",
      visible: true,
    },
    {
      id: "feat-002",
      name: "Modern UI/UX",
      category: "Design",
      description: "Contemporary interfaces that users love, with accessibility and usability at the core.",
      icon: "Palette",
      visible: true,
    },
    {
      id: "feat-003",
      name: "Responsive Design",
      category: "Development",
      description: "Seamless experiences across desktop, tablet, and mobile devices.",
      icon: "Monitor",
      visible: true,
    },
    {
      id: "feat-004",
      name: "Scalable Architecture",
      category: "Technology",
      description: "Built to grow with your business, from startup to enterprise.",
      icon: "Layers",
      visible: true,
    },
    {
      id: "feat-005",
      name: "Technology-Focused",
      category: "Innovation",
      description: "Modern stacks including React, Tailwind, and AI integration capabilities.",
      icon: "Code",
      visible: true,
    },
    {
      id: "feat-006",
      name: "Transparent Collaboration",
      category: "Process",
      description: "Clear communication and regular progress updates throughout your project.",
      icon: "Share2",
      visible: true,
    },
  ],
  orders: [
    {
      id: "ord-001",
      customer: "Sarah Johnson",
      service: "Website Development",
      amount: 2499,
      orderDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: "Completed",
      paymentStatus: "Paid",
    },
    {
      id: "ord-002",
      customer: "Michael Chen",
      service: "Web Application Development",
      amount: 5999,
      orderDate: new Date(Date.now() - 86400000 * 12).toISOString(),
      status: "In Progress",
      paymentStatus: "Partially Paid",
    },
    {
      id: "ord-003",
      customer: "Elena Rodriguez",
      service: "UI/UX Design",
      amount: 1299,
      orderDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "Confirmed",
      paymentStatus: "Paid",
    },
    {
      id: "ord-004",
      customer: "David Okonkwo",
      service: "Digital Marketing",
      amount: 799,
      orderDate: new Date(Date.now() - 86400000 * 20).toISOString(),
      status: "Pending",
      paymentStatus: "Unpaid",
    },
    {
      id: "ord-005",
      customer: "Priya Sharma",
      service: "AI and Automation",
      amount: 3499,
      orderDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      status: "Completed",
      paymentStatus: "Paid",
    },
  ],
  customers: [
    {
      id: "cust-001",
      name: "Sarah Johnson",
      email: "sarah@brightstart.com",
      phone: "+1 (555) 123-4567",
      company: "Bright Start Solutions",
      status: "Active",
      orders: 2,
      enquiries: 1,
      lastActivity: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "cust-002",
      name: "Michael Chen",
      email: "michael@techflow.io",
      phone: "+1 (555) 234-5678",
      company: "TechFlow Systems",
      status: "Active",
      orders: 1,
      enquiries: 2,
      lastActivity: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: "cust-003",
      name: "Elena Rodriguez",
      email: "elena@designhub.co",
      phone: "+1 (555) 345-6789",
      company: "Design Hub Studio",
      status: "Active",
      orders: 1,
      enquiries: 0,
      lastActivity: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: "cust-004",
      name: "David Okonkwo",
      email: "david@growthlabs.ng",
      phone: "+234 800 123 4567",
      company: "Growth Labs Nigeria",
      status: "Inactive",
      orders: 0,
      enquiries: 1,
      lastActivity: new Date(Date.now() - 86400000 * 45).toISOString(),
    },
    {
      id: "cust-005",
      name: "Priya Sharma",
      email: "priya@innovate.in",
      phone: "+91 98765 43210",
      company: "Innovate India",
      status: "Active",
      orders: 2,
      enquiries: 0,
      lastActivity: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ],
  contacts: [
    {
      id: "cnt-001",
      customerName: "Alex Thompson",
      email: "alex@startupio.com",
      phone: "+1 (555) 111-2222",
      company: "StartupIO",
      service: "Website Development",
      budget: "$5,000 - $10,000",
      submissionDate: new Date(Date.now() - 86400000 * 1).toISOString(),
      status: "New",
    },
    {
      id: "cnt-002",
      customerName: "Maria Garcia",
      email: "maria@designpro.com",
      phone: "+1 (555) 222-3333",
      company: "DesignPro Agency",
      service: "UI/UX Design",
      budget: "$2,000 - $5,000",
      submissionDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: "Contacted",
    },
    {
      id: "cnt-003",
      customerName: "James Wilson",
      email: "james@enterprise.com",
      phone: "+1 (555) 333-4444",
      company: "Enterprise Solutions",
      service: "Web Application Development",
      budget: "$10,000+",
      submissionDate: new Date(Date.now() - 86400000 * 7).toISOString(),
      status: "In Discussion",
    },
    {
      id: "cnt-004",
      customerName: "Lisa Zhang",
      email: "lisa@techcorp.cn",
      phone: "+86 10 1234 5678",
      company: "TechCorp China",
      service: "AI and Automation",
      budget: "$15,000+",
      submissionDate: new Date(Date.now() - 86400000 * 14).toISOString(),
      status: "Converted",
    },
  ],
  portfolio: [
    {
      id: "port-001",
      title: "E-Commerce Platform for Luna Boutique",
      slug: "ecommerce-luna-boutique",
      category: "Websites",
      description:
        "A complete e-commerce frontend experience for Luna Boutique, featuring product catalog, shopping cart, and checkout flow with responsive design.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      technologies: ["React", "Tailwind CSS", "JavaScript"],
      liveUrl: "https://example.com",
      visibility: true,
      createdDate: new Date().toISOString(),
    },
    {
      id: "port-002",
      title: "FinTech Dashboard for Nova Bank",
      slug: "fintech-dashboard-nova-bank",
      category: "Web Applications",
      description:
        "Business dashboard for Nova Bank with transaction analytics, account management, and real-time data visualization.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      technologies: ["React", "Recharts", "Tailwind CSS"],
      liveUrl: "https://example.com",
      visibility: true,
      createdDate: new Date().toISOString(),
    },
    {
      id: "port-003",
      title: "Brand Identity for Apex Fitness",
      slug: "brand-identity-apex-fitness",
      category: "Branding",
      description:
        "Complete brand identity system including logo, color palette, typography, and brand guidelines for Apex Fitness.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      technologies: ["Figma", "Illustrator", "Brand Strategy"],
      liveUrl: "https://example.com",
      visibility: true,
      createdDate: new Date().toISOString(),
    },
    {
      id: "port-004",
      title: "AI Chatbot for Support Desk",
      slug: "ai-chatbot-support-desk",
      category: "AI Solutions",
      description:
        "AI-powered customer support chatbot interface with natural language processing and ticket escalation workflows.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      technologies: ["React", "AI Integration", "Node.js"],
      liveUrl: "https://example.com",
      visibility: true,
      createdDate: new Date().toISOString(),
    },
  ],
  company: {
    name: "GrowthVerse",
    tagline: "Build Digital. Grow Business.",
    description:
      "A modern digital technology and solutions company helping businesses establish and improve their digital presence.",
    logo: "",
    website: "https://github.com/Aashu31/Growthverse",
    contactEmail: "",
    contactPhone: "",
    businessAddress: "",
    socialMedia: {
      twitter: "",
      linkedin: "",
      github: "https://github.com/Aashu31/Growthverse",
    },
  },
});

export default DataContext;
