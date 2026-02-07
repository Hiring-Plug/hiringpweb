# Hiring Plug 🔌

**Hiring Plug** is a decentralized, Web3-native hiring ecosystem designed to connect specialized talent with blockchain projects, DAOs, and protocols. It replaces traditional web2 recruitment with a transparent, role-based platform that emphasizes verifiable skills and on-chain identity.

## Overview

The platform serves two distinct user types:
1.  **Talent**: Developers, Designers, and Community Managers seeking opportunities.
2.  **Projects**: Web3 Protocols and Companies looking to hire verified talent.

Built with performance and security in mind, the application leverages **React 19** for a responsive frontend and **Supabase** for a robust, secure backend infrastructure.

## Key Features

-   **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for "Talent" and "Project" roles.
-   **Dynamic Profiles**:
    -   *Talents* showcase verified skills, experience, and portfolios.
    -   *Projects* display TVL, funding rounds, and active job listings.
-   **Job Board System**: Projects can post roles; Talents can apply directly.
-   **Real-time Updates**: Instant reflection of profile changes and status updates.
-   **Secure Authentication**: Email/Password and Social Login support via Supabase Auth.
-   **Asset Management**: Integrated image storage for avatars and banners.

## 🛠 Tech Stack

### Frontend
-   **Framework**: React 19 (via Vite)
-   **Routing**: React Router DOM v6+
-   **Styling**: Vanilla CSS (Performance-focused, variable-based architecture)
-   **Icons**: React Icons (Fa)

### Backend (Supabase)
-   **Database**: PostgreSQL
-   **Authentication**: Supabase Auth (JWT based)
-   **Storage**: Supabase Storage (Buckets for Avatars/Banners)
-   **Security**: Row Level Security (RLS) policies enforced on all tables.

## Architecture

The project follows a scalable, component-driven architecture:

```
src/
├── assets/          # Static images and branding assets
├── components/      # Reusable UI components (Button, Card, Modal, Navbar)
├── context/         # React Context for global state (AuthContext)
├── db/              # SQL Schemas and Migration scripts
├── pages/           # Route views
│   ├── dashboard/   # Protected user interfaces (Profile, Settings)
│   └── ...          # Public pages (Home, Jobs, Communities)
└── services/        # API and utility functions
```

## Security & Audit Notes

For auditors and developers reviewing the codebase:

1.  **Row Level Security (RLS)**:
    -   All database tables (`profiles`, `jobs`, `applications`) have RLS enabled.
    -   Users can only edit their own data (`auth.uid() = id`).
    -   Public read access is granted where appropriate (e.g., job listings).

2.  **Authentication**:
    -   Managed entirely by Supabase GoTrue.
    -   Client-side sessions are handled via `AuthContext`.
    -   Protected routes prevent unauthorized access to Dashboard/Settings.

3.  **Data Validation**:
    -   Inputs are validated on the client side before submission.
    -   Database constraints (Check Constraints) enforce data integrity (e.g., valid role types).

## Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/hiring-plug.git
    cd hiring-plug/app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the `app` root:
    ```env
    VITE_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY
    ```

4.  Run the Development Server:
    ```bash
    npm run dev
    ```

## 🗄 Database Schema

Make sure your Supabase project has the following tables set up (see `src/db/schema.sql`):

-   **profiles**: `id` (PK, FK to Auth), `role` ('talent'|'project'), `skills`, `experience`, `custom_metrics`.
-   **jobs**: `id` (PK), `project_id` (FK), `title`, `description`, `budget`.
-   **applications**: `id`, `job_id`, `candidate_id`, `status`.
