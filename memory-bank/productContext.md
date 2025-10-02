# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-10-02 10:52:53 - Log of updates made will be appended as footnotes to the end of this file.

*

## Project Goal

Build a modern, React-based showcase application that demonstrates complete modernization of the ShearStream oil & gas frac monitoring platform. The goal is to create a dashboard that is 110%+ better than the original Vue.js application, featuring:
- Modern React 19 + TypeScript architecture
- Real-time data visualization with 2-second polling
- Beautiful glassmorphism design with perfect 8-point grid alignment
- PWA capabilities for offline access
- Enhanced features like predictive alerts, AI insights, and collaboration tools

## Key Features

### Current Implementation (Completed):
- ✅ Landing page with hero section and feature showcase
- ✅ Dashboard with live job monitoring (Job #746 - Ballard-Joanne-Fed)
- ✅ **SciChart.js Unified Chart:** Professional WebGL-accelerated visualization with all channels in single overlay
- ✅ **Vercel API Proxy:** Serverless CORS-free data access with secure credential management
- ✅ Interactive chart controls: pan, zoom, hover inspection, zoom-to-fit
- ✅ Multi-axis support: Pressure (left), Rate (left), Concentration (right)
- ✅ Real-time value display boxes with trend indicators
- ✅ KPI cards: Active Channels, Data Points, Refresh Rate
- ✅ Treatment Summary: Volume, Proppant, Avg Pressure, Current Stage
- ✅ Real-time data updates every 2 seconds with 60 FPS rendering
- ✅ Time range selector (5m, 15m, 1h, 4h, All)
- ✅ Channel visibility toggles (8 channels)
- ✅ Perfect alignment with 8-point grid system
- ✅ Modern dark theme with petroleum orange branding

### API Integration (Completed):
- ✅ Phase 1: Core Data endpoints (15+ endpoints tested)
- ✅ Phase 2: Time Series Data endpoints (real-time polling)
- ✅ Comprehensive API documentation (API_RESPONSES.md)
- ✅ Safe GET-only testing on production system
- ✅ **Real-Time API Integration Infrastructure:** Complete API service layer with OAuth authentication, 2-second polling, error handling, and React Query hooks for seamless data fetching

### Missing Features (From Original):
- 🔴 Projects Overview Page (main dashboard with all projects)
- 🔴 Company Dashboard Page (company-specific view)
- 🔴 Charts Menu Page (chart management)
- 🔴 Real-time value displays below charts (large colored boxes)
- 🔴 Chart toolbar (zoom, draw, settings)
- 🔴 Full breadcrumb hierarchy (Company → Pad → Project → Chart)

### Killer Features (Planned - See KILLER_FEATURES.md):
- AI-powered predictive alerts
- Historical job comparison
- Time travel replay
- Multi-job dashboard
- Voice commands & AI assistant
- Real-time collaboration
- Custom dashboard builder

## Overall Architecture

### Tech Stack:
- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Charts:** SciChart.js Community Edition (WebGL/WebAssembly accelerated)
- **Animation:** Framer Motion
- **Data Fetching:** TanStack Query
- **API Proxy:** Vercel Serverless Functions
- **PWA:** vite-plugin-pwa + Workbox
- **Icons:** Lucide React

### Architecture Patterns:
- Component-based architecture
- Custom hooks for data fetching
- Context for global state (if needed)
- Service layer for API calls
- Type-safe API interfaces

### API Architecture:
- **Base URL:** https://production.api.shearstreaming.com
- **Authentication:** OAuth 2.0 via Keycloak
- **Polling:** 2-second intervals for real-time data
- **Endpoints:** REST API with GET-only operations (safe for production)

### Data Flow:
1. useJobData hook fetches timeseries metadata
2. useTimeseriesData hook polls data every 2 seconds
3. Charts receive data and render with Recharts
4. State updates trigger smooth Framer Motion animations

### File Structure:
```
src/
├── components/
│   ├── charts/          # Recharts components
│   ├── ChartControls.tsx
│   ├── TreatmentSummary.tsx
│   └── BottomNav.tsx
├── pages/
│   ├── Landing.tsx
│   └── Dashboard.tsx
├── services/
│   └── api.ts          # API service layer
├── types/
│   └── index.ts        # TypeScript interfaces
└── App.tsx

docs/
├── PRESENTATION.md              # 10-page slide deck
├── FEATURE_PARITY_ANALYSIS.md  # Gap analysis
├── KILLER_FEATURES.md          # 18 innovative features
└── API_RESPONSES.md            # Complete API documentation
```

### Design System:
- **Grid:** 8-point system (8px, 16px, 24px, 32px, 48px)
- **Colors:** Petroleum orange (#FB923C), Dark theme, Glass morphism
- **Typography:** System fonts, clear hierarchy
- **Spacing:** Consistent padding/margins using 8pt grid
- **Alignment:** Perfect centering with flexbox patterns

---

[2025-10-02 11:09:48] - New feature: Implemented real API integration for timeseries data with OAuth authentication, 2-second polling, and comprehensive error handling
[2025-10-02 12:17:27] - New feature: Upgraded to SciChart.js unified chart with Vercel API proxy for real data integration