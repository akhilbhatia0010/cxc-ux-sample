# CXC EPS — Caribbean Examinations Council

A modern web-based Examinations Processing System (EPS) UX prototype built for the Caribbean Examinations Council (CXC). This application covers the end-to-end examination workflow including registration, scoring, grading, and reporting.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** GitHub Pages (via GitHub Actions)

## Modules

| Module | Description |
|---|---|
| Subject Management | Components, weighting, carry-forward, and boundary configuration |
| Scoring Workspace | MC upload, SBA moderation, missing marks, composite score pipeline |
| Grading Workbench | Trial grading, grade boundaries, profile grading, committee review |
| Reporting Framework | Report library, live parameter builder, PDF/Excel export |

## Roles

The app supports five demo roles selectable at login:

- **CXC Admin** — full system access
- **School Admin** — school-level registration, SBA, and billing
- **Teacher** — SBA score entry and portfolio management
- **Local Registrar** — candidate approval and EMIS sync
- **Private Candidate** — self-registration flow

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

Pushes to the `main` branch automatically deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.
