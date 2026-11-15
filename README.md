# GrowthVerse

**Build Digital. Grow Business.**

GrowthVerse is a modern digital technology and solutions company website with an integrated frontend business dashboard. It presents company information, services, features, pricing, technology capabilities, portfolio, and contact options while providing frontend interfaces for managing business information, customers, orders, enquiries, and company profiles.

**Project Version:** 1.0.0  
**Copyright:** © 2026 GrowthVerse  
**License:** MIT License  
**Project Status:** Frontend Complete — All Pages and Dashboard Modules Implemented  
**Repository:** https://github.com/Aashu31/Growthverse

[![React.js](https://img.shields.io/badge/React.js-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JSX](https://img.shields.io/badge/JSX-Enabled-blue?logo=react)](https://reactjs.org/docs/introducing-jsx.html)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router DOM](https://img.shields.io/badge/React%20Router%20DOM-6.x-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Webpack](https://img.shields.io/badge/Webpack-5.x-8DD6F9?logo=webpack&logoColor=black)](https://webpack.js.org/)
[![Babel](https://img.shields.io/badge/Babel-7.x-F9DC3E?logo=babel&logoColor=black)](https://babeljs.io/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.x-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Lucide React](https://img.shields.io/badge/Lucide%20React-0.x-000000?logo=lucide&logoColor=white)](https://lucide.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-F2753C?logo=recharts&logoColor=white)](https://recharts.org/)
[![React Context API](https://img.shields.io/badge/React%20Context%20API-State%20Management-blue?logo=react)](https://reactjs.org/docs/context.html)
[![npm](https://img.shields.io/badge/npm-Package%20Manager-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Project Status](https://img.shields.io/badge/Status-Frontend%20Complete-blueviolet)](https://github.com/Aashu31/Growthverse)

---

## 2. Introduction

GrowthVerse is a complete frontend application built with React.js, JavaScript ES6+, and Tailwind CSS, bundled with Webpack and Babel. The project delivers two primary experiences within a single codebase:

1. **Public Company Website** — a premium corporate website that introduces GrowthVerse, presents its services, features, technologies, pricing, portfolio, and contact options to visitors.
2. **Company Dashboard** — a centralized frontend workspace for managing business information, including services, pricing, features, company profile, contacts, orders, customers, portfolio, and settings.

Both experiences share a consistent brand identity and design system. The application is frontend-only — there is no backend server, no database, no secure authentication, and no payment processing. All data is stored locally using browser LocalStorage for demonstration purposes.

---

## 3. Company Overview

### Company Identity

GrowthVerse is a digital technology and solutions company. The brand positioning is:

**"Build Digital. Grow Business."**

GrowthVerse focuses on helping businesses, startups, entrepreneurs, and organizations establish, improve, and expand their digital presence through modern technology and digital solutions.

### Business Positioning

GrowthVerse positions itself as a provider of digital technology solutions. The public website communicates the company's value proposition to visitors, while the dashboard offers frontend tooling for internal business operations.

### Vision

To help businesses build, improve, and scale their digital presence through modern, responsive, and accessible frontend technology solutions.

### Mission

GrowthVerse delivers digital experiences that support business growth — from public-facing marketing websites to frontend dashboards that streamline business operations — using clean code, responsive design, and a maintainable component-based architecture.

### Objectives

- Establish a professional digital presence for GrowthVerse.
- Present company services, features, technologies, pricing, and portfolio to the public.
- Provide frontend interfaces for managing business information, customers, orders, enquiries, and company profiles.
- Deliver a modern, responsive, animated user experience using React and Tailwind CSS.

### Target Audience

- Businesses seeking a digital technology partner
- Visitors exploring company services, pricing, and portfolio
- Internal users managing dashboard operations (services, orders, customers, contacts)

### Core Values

- Innovation
- Reliability
- Creativity
- Professionalism
- Technical expertise
- Business growth

### Business Offerings

- Company branding and informational website
- Service and feature catalog presentation
- Pricing presentation
- Portfolio showcase
- Contact and enquiry handling
- Frontend dashboard for business operations management

---

## 4. Project Scope

### Public Company Website

The public website explains the company, its identity, services, pricing, features, technology capabilities, and portfolio. All pages are implemented:

- Home / Landing Page (`/`)
- About GrowthVerse (`/about`)
- Services (`/services`)
- Individual Service Details (`/services/:slug`)
- Features (`/features`)
- Technologies (`/technologies`)
- Pricing (`/pricing`)
- Portfolio (`/portfolio`)
- Individual Project Details (`/portfolio/:slug`)
- Sarthi (`/sarthi`)
- Contact (`/contact`)
- Login (`/login`)
- Signup (`/signup`)
- Forgot Password (`/forgot-password`)
- 404 Not Found (`*`)

### Company Dashboard

The dashboard provides frontend interfaces for viewing and managing business information. All modules are implemented:

1. Dashboard Overview (`/dashboard`)
2. Services Management (`/dashboard/services`)
3. Pricing Management (`/dashboard/pricing`)
4. Features Management (`/dashboard/features`)
5. Company Profile (`/dashboard/profile`)
6. Contacts Management (`/dashboard/contacts`)
7. Orders Management (`/dashboard/orders`)
8. Customers Management (`/dashboard/customers`)
9. Portfolio Management (`/dashboard/portfolio`)
10. Settings (`/dashboard/settings`)

### Authentication UI

Login, signup, and forgot password interfaces are implemented as frontend demonstrations. No real authentication backend, secure access control, or user session management exists. Demo credentials will simulate a successful login.

### Sarthi Feature Presentation

Sarthi is a School Management Solution presented as a service/feature under GrowthVerse.

- Sarthi is **not** a separate company.
- Sarthi is **not** a separate repository.
- Sarthi's school management software is **not** developed in this project.
- Sarthi backend functionality (student, attendance, fee, examination, or academic management systems) is **not** implemented.
- Only Sarthi's feature presentation and service information are documented within GrowthVerse.

---

## 5. Complete Feature Catalogue

### Public Website

| Feature | Purpose | Current Status | Notes |
|---------|---------|----------------|-------|
| Home / Landing Page | Entry point with hero, services, features, pricing preview | IMPLEMENTED | Fully animated with Framer Motion |
| About GrowthVerse | Company introduction, vision, mission, values, team | IMPLEMENTED | Team uses placeholder profiles |
| Services | Service catalogue with category filtering | IMPLEMENTED | 9 services represented |
| Individual Service Details | Dedicated page per service | IMPLEMENTED | Dynamic route `/services/:slug` |
| Features | Capabilities and solution qualities | IMPLEMENTED | 6 features with descriptions |
| Technologies | Technology stack showcase | IMPLEMENTED | 8 categories, capability-focused |
| Pricing | 4 pricing plans with comparison | IMPLEMENTED | Demo values, not actual pricing |
| Portfolio | Project gallery with category filtering | IMPLEMENTED | Sample projects, clearly labelled |
| Individual Project Details | Dedicated page per project | IMPLEMENTED | Dynamic route `/portfolio/:slug` |
| Sarthi Feature Page | School management solution marketing | IMPLEMENTED | Feature presentation only |
| Contact | Enquiry form with validation | IMPLEMENTED | Frontend-only, LocalStorage storage |
| Login | Authentication UI | IMPLEMENTED | Frontend demo only |
| Signup | Registration UI | IMPLEMENTED | Frontend demo only |
| Forgot Password | Password reset UI | IMPLEMENTED | Frontend demo only |
| 404 Page | Route not found handling | IMPLEMENTED | Wildcard route |

### Business Dashboard

| Module | Purpose | Current Status | Notes |
|--------|---------|----------------|-------|
| Dashboard Overview | Statistics, charts, recent activity | IMPLEMENTED | Recharts, demo data |
| Services Management | CRUD for service listings | IMPLEMENTED | Full CRUD with LocalStorage |
| Pricing Management | CRUD for pricing plans | IMPLEMENTED | Full CRUD with LocalStorage |
| Features Management | CRUD for feature listings | IMPLEMENTED | Full CRUD with LocalStorage |
| Company Profile | Edit company information | IMPLEMENTED | LocalStorage persistence |
| Contacts Management | CRUD for enquiries | IMPLEMENTED | Status tracking, search, filter |
| Orders Management | CRUD for orders | IMPLEMENTED | Demo data, no payment processing |
| Customers Management | CRUD for customer records | IMPLEMENTED | Demo data |
| Portfolio Management | CRUD for portfolio projects | IMPLEMENTED | Image URLs, visibility toggle |
| Settings | Theme, general, data preferences | IMPLEMENTED | Dark/light theme, demo data reset |

---

## 6. Dashboard Module Explanations

### Dashboard Overview

**Purpose:** High-level summary view displaying key business metrics and statistics.

**What it manages:** Total customers, total orders, active services, pending enquiries, and demo revenue.

**User interactions:** View statistics, charts (revenue overview, monthly orders, order status distribution), recent orders table.

**Business purpose:** Give dashboard users a quick snapshot of business operations.

**Implementation status:** IMPLEMENTED. Uses Recharts for data visualization. All statistics are clearly identified as sample demonstration data.

### Services Management

**Purpose:** Interface for viewing, creating, editing, and deleting service listings.

**What it manages:** Service name, slug, category, description, features, icon, status, created date.

**User interactions:** Add service, edit service, delete service (with confirmation), search, filter by status.

**Business purpose:** Maintain the catalog of services offered by GrowthVerse.

**Implementation status:** IMPLEMENTED. Full frontend CRUD with LocalStorage persistence.

### Pricing Management

**Purpose:** Interface for managing pricing plans and tiers.

**What it manages:** Plan name, description, price, currency, billing type, features, limitations, popular status, active status.

**User interactions:** Add plan, edit plan, delete plan, toggle popular status.

**Business purpose:** Maintain pricing information presented on the public website.

**Implementation status:** IMPLEMENTED. Full frontend CRUD with LocalStorage persistence.

### Features Management

**Purpose:** Interface for managing feature listings and capability descriptions.

**What it manages:** Feature name, category, description, icon, visibility.

**User interactions:** Add feature, edit feature, delete feature, search, toggle visibility.

**Business purpose:** Maintain the capabilities and features presented to customers.

**Implementation status:** IMPLEMENTED. Full frontend CRUD with LocalStorage persistence.

### Company Profile

**Purpose:** Interface for editing company profile information.

**What it manages:** Company name, tagline, description, website, contact email, contact phone, business address, social media URLs.

**User interactions:** View profile, edit profile, save changes locally, reset demo information.

**Business purpose:** Keep company information up to date across the platform.

**Implementation status:** IMPLEMENTED. LocalStorage persistence. Placeholder values used where actual company information is unavailable.

### Contacts Management

**Purpose:** Interface for viewing and managing contacts and enquiries.

**What it manages:** Customer name, email, phone, company, service, budget, submission date, status.

**User interactions:** Add enquiry, edit enquiry, delete enquiry, search, filter by status, view details.

**Business purpose:** Handle enquiries submitted through the public contact page.

**Implementation status:** IMPLEMENTED. Full frontend CRUD with status tracking (New, Contacted, In Discussion, Converted, Closed).

### Orders Management

**Purpose:** Interface for tracking and managing orders.

**What it manages:** Order ID, customer, service, amount, order date, order status, payment status.

**User interactions:** Add order, edit order, delete order, search, view order details.

**Business purpose:** Track customer orders and transactions.

**Implementation status:** IMPLEMENTED. Demo data only — no real payment processing or transaction system.

### Customers Management

**Purpose:** Interface for managing customer records.

**What it manages:** Customer name, email, phone, company, status, orders count, enquiries count, last activity.

**User interactions:** Add customer, edit customer, delete customer, search.

**Business purpose:** Maintain customer records and relationships.

**Implementation status:** IMPLEMENTED. Demo data only.

### Portfolio Management

**Purpose:** Interface for managing portfolio projects and case studies.

**What it manages:** Project title, slug, category, description, image URL, technologies, live URL, visibility.

**User interactions:** Add project, edit project, delete project, toggle visibility.

**Business purpose:** Showcase completed work and case studies.

**Implementation status:** IMPLEMENTED. Uses sample Unsplash images for demonstration.

### Settings

**Purpose:** Application configuration interface.

**What it manages:** Theme preference (light/dark), general settings, data preferences.

**User interactions:** Toggle theme, reset demo data, configure currency and date format.

**Business purpose:** Allow users to customize their dashboard experience.

**Implementation status:** IMPLEMENTED. Dark/light theme with LocalStorage persistence. Demo data reset with confirmation dialog.

---

## 7. Technology Stack

All technologies below are verified as installed and configured in the repository.

### Frontend

| Technology | Version | Purpose | Verified |
|------------|---------|---------|----------|
| React.js | 18.3.1 | UI library for component-based interfaces | Yes |
| JavaScript ES6+ | — | Application language | Yes |
| JSX | — | Template syntax for React components | Yes |
| HTML5 | — | Markup structure | Yes |
| CSS3 | — | Styling language | Yes |

### Build Tools

| Technology | Version | Purpose | Verified |
|------------|---------|---------|----------|
| Webpack | 5.112.2 | Module bundler and build tool | Yes |
| Babel | 7.x | JavaScript transpiler | Yes |
| webpack-dev-server | 5.0.4 | Development server with HMR | Yes |

### Styling

| Technology | Version | Purpose | Verified |
|------------|---------|---------|----------|
| Tailwind CSS | 3.4.10 | Utility-first CSS framework | Yes |
| PostCSS | 8.4.41 | CSS processing | Yes |
| Autoprefixer | — | CSS vendor prefixing | Yes |

### Routing

| Technology | Version | Purpose | Verified |
|------------|---------|---------|----------|
| React Router DOM | 6.26.2 | Client-side routing | Yes |

### State Management

| Technology | Version | Purpose | Verified |
|------------|---------|---------|----------|
| React Context API | 18.3.1 | Global application state | Yes |
| React Hooks | 18.3.1 | Local component state | Yes |
| LocalStorage | — | Browser persistence | Yes |

### Animation

| Technology | Version | Purpose | Verified |
|------------|---------|---------|----------|
| Framer Motion | 11.3.8 | Page transitions and UI animations | Yes |

### Charts

| Technology | Version | Purpose | Verified |
|------------|---------|---------|----------|
| Recharts | 2.12.7 | Data visualization in dashboard | Yes |

### Icons

| Technology | Version | Purpose | Verified |
|------------|---------|---------|----------|
| Lucide React | 0.427.0 | Icon library | Yes |

### Development Tooling

| Technology | Version | Purpose | Verified |
|------------|---------|---------|----------|
| npm | 11.20.0 | Package manager | Yes |

### Important Technical Decisions

- **React.js frontend only** — no backend, no server-side rendering
- **JavaScript only, not TypeScript**
- **JSX for React components**
- **Webpack rather than Vite** — configured with `webpack.config.js`
- **No Next.js**
- **No backend development** — no Express, Fastify, or Node.js APIs
- **No database** — no PostgreSQL, MySQL, MongoDB, Prisma, Firebase, or Supabase
- **No real authentication** — no external auth services
- **No real payment processing** — no payment gateways

---

## 8. System Architecture

### React Application Structure

GrowthVerse uses a component-based React architecture with three layout types:

- **WebsiteLayout** — wraps public website pages with Navbar and Footer
- **AuthLayout** — wraps authentication pages (Login, Signup, Forgot Password)
- **DashboardLayout** — wraps dashboard pages with Sidebar, Topbar, and main content area

### Component-Based Architecture

The UI is decomposed into reusable, self-contained components:

- **Common components:** Button, IconButton, Badge, Card, Modal, ConfirmDialog, Toast, Loader, Skeleton, EmptyState, SearchInput, FormInput, Select, Textarea, Pagination, Accordion, Tabs
- **Website components:** Navbar, Footer, Hero (inline), service cards, feature cards, pricing cards, portfolio cards
- **Dashboard components:** Sidebar, DashboardHeader, Breadcrumb, StatCard, DataTable, FilterBar, StatusBadge, PageHeader

Components receive data through props and manage local state with React hooks (`useState`, `useEffect`, etc.).

### Page Organization

**Public website pages:** Home, About, Services, ServiceDetails, Features, Technologies, Pricing, Portfolio, ProjectDetails, Sarthi, Contact, NotFound.

**Authentication pages:** Login, Signup, ForgotPassword.

**Dashboard pages:** Overview, ServicesManagement, PricingManagement, FeaturesManagement, ProfileManagement, ContactsManagement, OrdersManagement, CustomersManagement, PortfolioManagement, Settings.

### Layout Structure

Shared layout components wrap page content and provide consistent navigation, headers, footers, and sidebars across the public website and dashboard.

### Client-Side Routing

Client-side routing is handled by React Router DOM with `BrowserRouter`. Routes are organized into:

- Public website routes (WebsiteLayout)
- Authentication routes (AuthLayout)
- Dashboard routes (DashboardLayout)
- Wildcard 404 route

### State Management

Application state is managed using:

- **React Context API** for global state (ThemeContext, AuthContext, DataContext)
- **React Hooks** for local component state
- **LocalStorage** for client-side persistence of theme, demo user, and business data

### Data Layer

Data is organized into reusable JavaScript modules in `src/data/index.js`. All data is local mock data for demonstration purposes. Browser LocalStorage is used for client-side persistence.

**Limitation:** LocalStorage does not provide multi-user synchronization. Data is scoped to the individual browser and device.

### Styling

Styling uses Tailwind CSS utility classes with custom CSS. A hybrid dark/light theme is supported via CSS variables and Tailwind's `darkMode: 'class'` configuration.

### Webpack Build Process

Webpack is configured as the module bundler and build tool. It handles:

- React JSX compilation via Babel
- CSS processing with PostCSS, Tailwind CSS, and Autoprefixer
- Asset handling (images, fonts)
- Development server with hot module replacement and history API fallback
- Production bundling with minification and source maps

---

## 9. Application Flow

### Public Visitor Flow

1. **Home** — Land on the homepage and view company overview
2. **Services** — Browse the catalog of services offered
3. **Service Details** — View details of an individual service
4. **Pricing** — Review pricing plans and tiers
5. **Contact** — Submit an enquiry through the contact page

### Dashboard User Flow

1. **Login UI** — View the login page (frontend demonstration only; no real authentication)
2. **Dashboard Overview** — View high-level summary and statistics
3. **Business Modules** — Navigate to specific modules (Services, Pricing, Features, Profile, Contacts, Orders, Customers, Portfolio, Settings)

**Important:** The login page is only a frontend demo. It does not provide secure access control, user session management, or any backend authentication. Entering credentials in the login UI simulates a successful login for demonstration purposes.

---

## 10. Actual Project Directory Structure

```
growthverse/
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── webpack.config.js
├── babel.config.js
├── postcss.config.js
├── tailwind.config.js
├── public/
│   └── index.html
├── src/
│   ├── index.jsx
│   ├── App.jsx
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Dropdown.jsx
│   │   ├── navigation/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── website/
│   │       └── SectionHeader.jsx
│   ├── layouts/
│   │   ├── WebsiteLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── website/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── ServiceDetails.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Technologies.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Sarthi.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── NotFound.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ForgotPassword.jsx
│   │   └── dashboard/
│   │       ├── Overview.jsx
│   │       ├── ServicesManagement.jsx
│   │       ├── PricingManagement.jsx
│   │       ├── FeaturesManagement.jsx
│   │       ├── ProfileManagement.jsx
│   │       ├── ContactsManagement.jsx
│   │       ├── OrdersManagement.jsx
│   │       ├── CustomersManagement.jsx
│   │       ├── PortfolioManagement.jsx
│   │       └── Settings.jsx
│   ├── data/
│   │   └── index.js
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useCrud.js
│   │   └── useMediaQuery.js
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── helpers.js
│   └── styles/
│       └── index.css
├── dist/ (production build output)
└── node_modules/
```

---

## 11. Installation and Setup

### Prerequisites

| Tool | Purpose | Version |
|------|---------|---------|
| Node.js | JavaScript runtime | v26.13.0 |
| npm | Package manager | 11.20.0 |
| Git | Version control | Required |

### Repository Cloning

```bash
git clone https://github.com/Aashu31/Growthverse.git
cd Growthverse
```

### Installation

```bash
npm install
```

---

## 12. Running the Project

### Development Server

```bash
npm run frontend
```

This starts the Webpack development server with hot module replacement at **http://localhost:3000**.

### Production Build

```bash
npm run build
```

This produces a production-ready, minified bundle in the `dist/` directory using Webpack.

---

## 13. Application Routes

### Public Website Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Home / Landing Page | IMPLEMENTED |
| `/about` | About GrowthVerse | IMPLEMENTED |
| `/services` | Services catalogue | IMPLEMENTED |
| `/services/:slug` | Individual Service Details | IMPLEMENTED |
| `/features` | Features | IMPLEMENTED |
| `/technologies` | Technologies | IMPLEMENTED |
| `/pricing` | Pricing | IMPLEMENTED |
| `/portfolio` | Portfolio | IMPLEMENTED |
| `/portfolio/:slug` | Project Details | IMPLEMENTED |
| `/sarthi` | Sarthi Feature Page | IMPLEMENTED |
| `/contact` | Contact | IMPLEMENTED |
| `/login` | Login UI | IMPLEMENTED (frontend demo) |
| `/signup` | Signup UI | IMPLEMENTED (frontend demo) |
| `/forgot-password` | Forgot Password UI | IMPLEMENTED (frontend demo) |
| `*` | 404 Not Found | IMPLEMENTED |

### Authentication Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/login` | User login page | IMPLEMENTED (frontend demo only) |
| `/signup` | User signup page | IMPLEMENTED (frontend demo only) |
| `/forgot-password` | Password reset page | IMPLEMENTED (frontend demo only) |

### Dashboard Routes

| Route | Module | Status |
|-------|--------|--------|
| `/dashboard` | Dashboard Overview | IMPLEMENTED |
| `/dashboard/services` | Services Management | IMPLEMENTED |
| `/dashboard/pricing` | Pricing Management | IMPLEMENTED |
| `/dashboard/features` | Features Management | IMPLEMENTED |
| `/dashboard/profile` | Company Profile | IMPLEMENTED |
| `/dashboard/contacts` | Contacts Management | IMPLEMENTED |
| `/dashboard/orders` | Orders Management | IMPLEMENTED |
| `/dashboard/customers` | Customers Management | IMPLEMENTED |
| `/dashboard/portfolio` | Portfolio Management | IMPLEMENTED |
| `/dashboard/settings` | Settings | IMPLEMENTED |

---

## 14. Data Handling and Storage

### React State

Component-level state is managed with React hooks (`useState`, `useEffect`, etc.). Page and module state is kept local to the component tree unless lifted to a context provider.

### Context API

The React Context API provides global state management for:

- **ThemeContext** — Theme preference (dark/light mode), persisted in LocalStorage
- **AuthContext** — Authentication status (frontend demo only), persisted in LocalStorage
- **DataContext** — All business data (services, pricing, features, orders, customers, contacts, portfolio, company), persisted in LocalStorage

### Mock Data

Sample data (pricing, customers, orders, revenue, testimonials, statistics) is defined locally in `src/data/index.js`. All mock data is fictional and must not be interpreted as verified company records.

### LocalStorage

Browser LocalStorage is used for client-side persistence of:

- Theme preference
- Demo user session (login simulation)
- All business data (CRUD operations)

Data is stored as key-value pairs in the user's browser.

### Data Persistence

Data persists across page refreshes via LocalStorage. Changes made in the dashboard (CRUD operations) are immediately saved to LocalStorage.

### Browser Limitations

- LocalStorage data is scoped to the origin (protocol, domain, and port) and the specific browser profile.
- It is not transferred between browsers or devices.
- Clearing browser data removes LocalStorage contents.

### No Backend Synchronization

There is no backend, no API, and no database. LocalStorage does **not** provide multi-user synchronization. Data stored in LocalStorage is not shared across users, devices, or sessions on different machines.

---

## 15. Design System

### Hybrid Design

GrowthVerse uses a hybrid premium corporate design with:

- Dark premium hero sections
- Clean white content sections
- Light grey backgrounds
- Navy and electric-blue branding

### Brand Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Dark | #0B1020 | Background, dark mode surfaces |
| Secondary Dark | #111A2E | Dark mode cards and surfaces |
| Primary Blue | #3563FF | Primary actions, links, branding |
| Electric Blue | #5B8CFF | Secondary actions, highlights |
| Accent Violet | #8257F5 | Accent elements, highlights |
| Light Background | #F7F9FC | Light mode backgrounds |
| White | #FFFFFF | Cards, surfaces |
| Primary Text | #111827 | Headings, primary text |
| Secondary Text | #64748B | Body text, descriptions |
| Border | #E5E7EB | Borders, dividers |

### Typography

- Font family: Inter (with system-ui fallback)
- Font weights: 300, 400, 500, 600, 700, 800
- Clear hierarchy from h1 (3.5rem) to small text (0.875rem)

### Responsive Layouts

All pages and dashboard modules are built with responsive layouts using Tailwind CSS. Tested viewports:

- Desktop: 1440px
- Laptop: 1280px
- Tablet: 768px
- Mobile: 390px
- Small Mobile: 360px

### Animations

Framer Motion is used for:

- Hero text reveal and staggered content entrance
- Card hover interactions
- Navigation transitions
- Button interactions
- Modal entrances and dropdown animations
- Toast notifications
- Tab transitions

**Reduced motion:** Respects `prefers-reduced-motion` media query.

### Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- Accessible labels and ARIA attributes
- Keyboard navigation
- Visible focus states
- Sufficient color contrast
- Accessible modal behavior
- Form error descriptions

---

## 16. Testing and Quality Assurance

### Build Verification

- `npm install` — succeeds, installs all dependencies
- `npm run frontend` — starts development server at http://localhost:3000
- `npm run build` — succeeds, produces production bundle in `dist/`

### Manual Testing Procedures

- All public website pages render correctly
- Navigation works across all routes
- Dropdowns and mobile menu function
- Service details and project details load correctly via dynamic routes
- Pricing CTAs navigate to contact page
- FAQ accordions function correctly
- 404 page displays for invalid routes
- Contact form validation works (required fields, email format, character limits)
- Contact form submission stores data in LocalStorage
- All dashboard routes work
- Sidebar navigation and active states work
- CRUD operations work in all dashboard modules
- Search, filtering, and sorting work where implemented
- Modals and confirmation dialogs work
- LocalStorage persists data across page refreshes
- Reset functionality restores initial demo dataset
- Responsive dashboard works on mobile viewports
- Dark/light theme toggle works

### Test Status

All features have been manually tested. No automated testing framework is configured.

---

## 17. Development Roadmap

| Phase | Name | Status | Completion Evidence |
|-------|------|--------|---------------------|
| Phase 0 | Project Documentation and Foundation | IMPLEMENTED | Repository, README, LICENSE exist |
| Phase 1 | React Frontend Foundation | IMPLEMENTED | package.json, Webpack, Babel, Tailwind configured; `npm run frontend` and `npm run build` verified |
| Phase 2 | Design System and Shared Components | IMPLEMENTED | Reusable buttons, cards, modals, forms, navigation components |
| Phase 3 | Public Company Website | IMPLEMENTED | All 14 public pages implemented |
| Phase 4 | Authentication Frontend | IMPLEMENTED | Login, Signup, Forgot Password (frontend demo) |
| Phase 5 | Dashboard Foundation | IMPLEMENTED | Dashboard layout, sidebar, header, navigation |
| Phase 6 | Business Dashboard Modules | IMPLEMENTED | All 10 dashboard modules implemented |
| Phase 7 | Functional Frontend Interactions | IMPLEMENTED | CRUD, search, filtering, LocalStorage, toast notifications |
| Phase 8 | Responsive Design and Animation | IMPLEMENTED | Responsive layouts, Framer Motion animations, reduced-motion support |
| Phase 9 | Testing and Quality Assurance | IMPLEMENTED | Manual testing completed for all routes and modules |
| Phase 10 | Production Readiness | IMPLEMENTED | Production build verified with `npm run build` |

---

## 18. Known Limitations

- **Frontend-only architecture:** No backend server, no API, no server-side processing
- **No backend:** No Express, Fastify, or Node.js backend
- **No secure production authentication:** Login and signup are frontend demonstrations only
- **No database:** No PostgreSQL, MySQL, MongoDB, or other database
- **No actual payment processing:** Pricing is for information only; no payments are processed
- **No real email service:** Contact form submissions are not sent to a real email service
- **No multi-user synchronization:** LocalStorage does not sync data across users or devices
- **Sarthi is a feature presentation only:** School management software is not developed
- **Demo data:** All statistics, customers, orders, and pricing are sample demonstration data
- **No automated testing:** Testing is manual only

---

## 19. Future Scope

Future development directions (not part of V1):

- Backend integration (server, API, database)
- Secure authentication system with backend
- Real customer management with server persistence
- Real order management with server persistence
- Payment gateway integration
- Real email delivery for contact forms
- Production deployment (hosting, CI/CD)
- Dashboard expansion (additional modules, reports, analytics)
- Automated testing and CI pipelines

---

## 20. Contributing Guidelines

Contributions are welcome. To contribute:

1. **Fork the repository** on GitHub: https://github.com/Aashu31/Growthverse
2. **Create a feature branch:**

```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes** to the source code or documentation.
4. **Test your changes** locally by running the development server and production build:

```bash
npm run frontend
npm run build
```

5. **Commit your changes:**

```bash
git add .
git commit -m "Add your descriptive commit message"
```

6. **Push to your fork:**

```bash
git push origin feature/your-feature-name
```

7. **Submit a pull request** against the `master` branch of the GrowthVerse repository.

Please ensure your changes follow the development guidelines below and do not introduce false backend or implementation claims.

---

## 21. Coding Standards

### React Component Naming

- Use `PascalCase` for React components and component files (e.g., `Home.jsx`, `ServicesManagement.jsx`).
- Use `camelCase` for variables, functions, and object keys.
- Use `UPPER_SNAKE_CASE` for constants.
- Use descriptive, meaningful names.

### JavaScript Conventions

- Write modern JavaScript ES6+ syntax.
- Use `const` and `let` instead of `var`.
- Use arrow functions where appropriate.
- Use template literals for string interpolation.

### Component Reusability

- Build small, single-purpose components.
- Pass data via props; avoid deep prop lifting where Context API is appropriate.
- Keep components presentational where possible; separate logic from UI.

### Project Structure

- Organize code into `src/components`, `src/pages`, `src/context`, `src/data`, `src/hooks`, `src/utils`, and `src/styles`.
- Separate public website pages from dashboard modules.
- Keep shared components in a common directory.

### Responsive UI

- Use Tailwind CSS responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for breakpoints.
- Test layouts on mobile, tablet, and desktop viewports.
- Avoid fixed widths; use flexible and percentage-based layouts.

### Accessibility

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<section>`, etc.).
- Ensure interactive elements are keyboard accessible.
- Maintain sufficient color contrast between text and backgrounds.

### Code Quality

- Write clean, readable, and well-commented JavaScript.
- Follow consistent indentation and formatting.
- Avoid console logs in production-bound code.

### Dependency Management

- Install dependencies with `npm install <package>`.
- Record dependencies in `package.json`.
- Avoid adding unverified or unnecessary packages.
- Do not represent planned dependencies as installed.

---

## 22. Versioning and Changelog

### Versioning Approach

GrowthVerse uses semantic versioning (major.minor.patch). The current project version is 1.0.0.

### Changelog

**v1.0.0 — Initial Release**
- Complete frontend application with public website and business dashboard
- All 14 public website pages implemented
- All 10 dashboard modules implemented with full CRUD
- React Router DOM routing with dynamic routes
- React Context API state management with LocalStorage persistence
- Tailwind CSS design system with dark/light theme
- Framer Motion animations
- Recharts data visualization
- Webpack + Babel build configuration
- `npm run frontend` and `npm run build` scripts verified

---

## 23. License

This project is licensed under the MIT License.

Copyright (c) 2026 GrowthVerse.

See the full license text in the root [LICENSE](LICENSE) file.

---

## 24. Project Information

| Field | Value |
|-------|-------|
| Project | GrowthVerse |
| Repository | https://github.com/Aashu31/Growthverse |
| Repository Owner | Aashu31 |
| Copyright | 2026 GrowthVerse |
| License | MIT License |
| Version | 1.0.0 |
| Category | Digital Technology Company Website and Frontend Business Dashboard |
| Status | Frontend Complete — All Pages and Dashboard Modules Implemented |

No contact emails, business addresses, founder details, or deployment domains are available. Do not invent contact information.

---

## 25. Disclaimer

GrowthVerse V1 is a **frontend project**. It consists of a public company website and a frontend business dashboard built with React, JavaScript, and Tailwind CSS, bundled with Webpack.

Sample pricing, customer records, orders, revenue, testimonials, and business statistics displayed in the application are **demo/mock data** and must **not** be interpreted as verified company records, actual financial figures, or real customer information.

Sarthi is presented only as a marketing and feature page within GrowthVerse. Its backend, database, or school management functionality has not been implemented and is not part of this project's scope.

There is no backend, no production authentication, no real database, no payment processing, and no real email delivery in this version.
