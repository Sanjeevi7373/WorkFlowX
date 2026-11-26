# WorkFlowX - Enterprise Operations & Task Management Platform

WorkFlowX is an enterprise-style employee task and operations management platform frontend built with React, TypeScript, and Vite.

## Architecture

This frontend is designed to integrate with a Java Spring Boot backend using:
- **Java 17+ / Spring Boot 3+**
- **Spring Security** (JWT Authentication)
- **REST APIs** (configured via `VITE_API_BASE_URL`)
- **MySQL**

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios (modular instance in `src/services/api.ts`)
- **Icons**: Lucide React
- **Visualizations**: Recharts
- **Forms & Validation**: React Hook Form + Zod

## Folder Structure

```
src/
├── assets/                  # Static assets (images, icons)
├── components/
│   ├── ui/                  # Reusable UI primitives (Button, Card, Badge, Input)
│   ├── layout/              # SaaS frame layouts (AppLayout, AuthLayout, Sidebar, Header)
│   ├── dashboard/           # Dashboard-specific widgets and components
│   ├── projects/            # Project management components
│   ├── tasks/               # Task management components
│   ├── team/                # Team directory components
│   └── reports/             # Analytics and reporting components
├── pages/
│   ├── auth/                # Authentication pages (/login, /register, /forgot-password)
│   ├── dashboard/           # Dashboard overview (/dashboard)
│   ├── projects/            # Projects page (/projects)
│   ├── tasks/               # Tasks page (/tasks)
│   ├── team/                # Team page (/team)
│   ├── calendar/            # Operations calendar (/calendar)
│   ├── notifications/       # User alerts (/notifications)
│   ├── reports/             # Reports page (/reports)
│   ├── admin/               # Admin pages (/admin/users, /admin/teams, /admin/audit-logs)
│   ├── settings/            # Settings and profile pages (/settings, /profile)
│   └── NotFoundPage.tsx     # 404 fallback page
├── services/
│   └── api.ts               # Axios client configured with VITE_API_BASE_URL & JWT interceptors
├── hooks/
│   └── useAuth.ts           # Authentication hook
├── contexts/
│   ├── authContextDef.ts    # Auth context definition & types
│   ├── AuthContext.tsx      # AuthProvider component
│   └── index.ts
├── types/
│   ├── user.ts              # User & UserProfile models
│   ├── project.ts           # Project model
│   ├── task.ts              # Task model
│   ├── team.ts              # Team model
│   ├── notification.ts      # Notification model
│   └── index.ts             # Aggregated export
├── utils/
│   └── cn.ts                # Class name merging utility
├── mock/
│   └── mockData.ts          # Type-safe initial mock data
├── routes/
│   └── AppRoutes.tsx        # Centralized route configuration
├── App.tsx                  # App root with Providers
├── main.tsx                 # DOM entry point
└── index.css                # Base Tailwind CSS styles
```

## Getting Started

### Prerequisites

- Node.js (v18+ or v22+)
- npm (v9+)

### Installation

```bash
cd workflowx-frontend
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` (already created):

```bash
cp .env.example .env
```

Default configuration:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Running the Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Type Check & Production Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Deploying the frontend to Vercel

Vercel hosts this React frontend only. Login and registration also need the Spring Boot API and its MySQL database running on publicly reachable hosting; `localhost` points to the visitor's computer after deployment.

In Vercel, set the project root to `workflowx-frontend`, then add this environment variable under **Project Settings → Environment Variables**:

| Name | Value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://<your-public-backend-host>/api` |

Use the actual HTTPS URL where the Spring Boot API is deployed. Redeploy after setting or changing this value because Vite embeds it at build time.

Configure the backend hosting environment with:

| Name | Value |
| --- | --- |
| `DB_URL` | JDBC URL for your hosted MySQL database, such as `jdbc:mysql://<host>:3306/workflowx` |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | A private signing secret of at least 32 characters |
| `CORS_ALLOWED_ORIGINS` | The exact Vercel site origin, such as `https://your-project.vercel.app` (no trailing slash). Comma-separate any additional preview origins. |
| `FRONTEND_URL` | The exact Vercel site origin, used to build password-reset links |

After setting those values, redeploy/restart the backend, then redeploy the Vercel frontend. Do not set `VITE_API_BASE_URL` to `localhost` in Vercel.
