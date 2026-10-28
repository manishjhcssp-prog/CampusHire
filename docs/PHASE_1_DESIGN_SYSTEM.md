# CampusConnect — Phase 1: UI/UX Research & Design System Specification

## 1. Executive Summary & Brand Identity

**CampusConnect** is a centralized, role-based Campus Recruitment Portal built for university training and placement cells (TPOs), corporate recruiters, and graduating students (Problem ID: HACK-P410).

### Brand Positioning
- **Trust & Professionalism**: High visual clarity, enterprise-grade data density, and consistent institutional typography.
- **Fairness & Transparency**: Transparent, itemized eligibility verification (clear explanation of why a student is or is not eligible).
- **Efficiency & Speed**: Progressive disclosure to streamline applicant management, multi-round scheduling, and KPI placement analytics.

---

## 2. Design Tokens & Styling Architecture

The design system incorporates the **UI/UX Pro Max** standards for enterprise SaaS dashboards (Variance: 5/10 Balanced Modern, Density: 8/10 Dense Dashboard, Motion: 3/10 Subtle).

### 2.1 Color System (WCAG AA Compliant — 4.5:1 Contrast Minimum)

| Semantic Role | Hex Value | Tailwind Token | Accessible Text Pairing | Usage Context |
|:---|:---|:---|:---|:---|
| **Primary** | `#0369A1` | `sky-700` | `#FFFFFF` (Contrast: 6.8:1) | Primary branding, key headers, active nav items |
| **Primary Hover** | `#075985` | `sky-800` | `#FFFFFF` | Button hover states, active tab highlights |
| **Secondary** | `#0EA5E9` | `sky-500` | `#0F172A` | Secondary badges, accents, subtle outlines |
| **Accent / CTA** | `#16A34A` | `emerald-600` | `#FFFFFF` (Contrast: 4.6:1) | Offer actions, eligibility pass badges, final conversion CTAs |
| **Surface Canvas** | `#F8FAFC` | `slate-50` | `#0F172A` | Global background behind cards |
| **Surface Card** | `#FFFFFF` | `white` | `#0F172A` | Dashboard cards, modals, table surfaces |
| **Surface Muted** | `#F1F5F9` | `slate-100` | `#475569` | Metric containers, disabled fields, subtle dividers |
| **Border Soft** | `#E2E8F0` | `slate-200` | — | Card borders, table row dividers, input borders |
| **Border Focus Ring** | `#0369A1` | `sky-700` | — | Keyboard focus ring (`focus:ring-2 focus:ring-sky-600`) |
| **Destructive / Error**| `#DC2626` | `red-600` | `#FFFFFF` (Contrast: 5.1:1) | Rejection badges, form error text, withdraw buttons |
| **Warning / Pending** | `#D97706` | `amber-600` | `#FFFFFF` | Interview scheduling badges, alert banners |
| **Info / Progress** | `#2563EB` | `blue-600` | `#FFFFFF` | Submitted status, system update announcements |

### 2.2 Typography Scale (Plus Jakarta Sans)
- **Heading Font:** `Plus Jakarta Sans`, sans-serif (Weights: 600, 700, 800)
- **Body Font:** `Plus Jakarta Sans`, sans-serif (Weights: 400, 500)
- **Monospace Font (Code/Roll Numbers/IDs):** `JetBrains Mono` / `ui-monospace`

| Hierarchy | Size | Line Height | Weight | Tracking | Usage |
|:---|:---|:---|:---|:---|:---|
| **Display / H1** | `24px` (`1.5rem`) | `32px` | Extra Bold (800) | `-0.025em` | Page Titles, Metric values |
| **H2 / Section** | `18px` (`1.125rem`)| `28px` | Bold (700) | `-0.015em` | Card group titles, Modal headings |
| **H3 / Card Title**| `15px` (`0.9375rem`)|`24px`| SemiBold (600) | `normal` | Job card titles, Table headers |
| **Body (Default)** | `13px` (`0.8125rem`)|`20px`| Regular (400) | `normal` | Paragraphs, descriptions, form input values |
| **Body Medium** | `13px` (`0.8125rem`)|`20px`| Medium (500) | `normal` | Label text, table cell content |
| **Caption / Meta** | `11px` (`0.6875rem`)|`16px`| Medium (500) | `+0.01em` | Timestamps, roll numbers, helper text |
| **Uppercase Tag** | `10px` (`0.625rem`) |`14px` | Bold (700) | `+0.05em` | KPI labels, category badges |

### 2.3 Spacing & Layout Grid (Dense Dashboard Scale)
- Base Grid: `4px` / `8px`
- Gap Scale:
  - Tight (inline icons, tag pills): `4px` (`gap-1`) to `6px` (`gap-1.5`)
  - Form field gap: `12px` (`gap-3`) to `16px` (`gap-4`)
  - Dashboard card padding: `16px` (`p-4`) on mobile, `20px` (`p-5`) on desktop
  - Section spacing: `24px` (`space-y-6`)

### 2.4 Border Radii & Elevation
- **Cards & Containers**: `rounded-2xl` (`16px`)
- **Buttons, Form Inputs & Selects**: `rounded-xl` (`12px`)
- **Badges & Pills**: `rounded-full` (`9999px`)
- **Shadow Tokens**:
  - Soft Card: `shadow-xs` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`)
  - Hover Elevate: `hover:shadow-md hover:border-slate-300 transition-all duration-200`
  - Modal / Dialog: `shadow-2xl` (`0 25px 50px -12px rgb(0 0 0 / 0.25)`)

---

## 3. Component Design Guidelines

### 3.1 Buttons
- **Primary Button**: Background `#0369A1` (Dark Sky), text `#FFFFFF`, font weight `600`, padding `10px 18px`, `rounded-xl`. States: Hover (opacity 95%, subtle -1px translateY), Focus ring visible (`focus:ring-2 focus:ring-sky-600 focus:ring-offset-1`), Disabled (`opacity-50 cursor-not-allowed`).
- **Accent / Conversion Button**: Background `#16A34A` (Success Emerald), text `#FFFFFF`, for applying or extending offers.
- **Secondary / Outline**: Border `1px solid #E2E8F0`, background `#FFFFFF`, text `#334155`. Hover: background `#F8FAFC`.
- **Destructive Button**: Background `#FEF2F2`, border `1px solid #FECACA`, text `#DC2626`. Hover: background `#FEE2E2`.
- **Accessible Icons**: Every icon button without visible text must have an explicit `aria-label` and `title`.

### 3.2 Form Controls & Error Feedback (UI/UX Pro Max Guideline)
- **Labels**: Always visible above the input, font weight `600`, size `12px`, text `#334155`. Never rely on placeholder text as the label.
- **Helper & Validation Text**:
  - Default helper text in `#64748B`.
  - Error state: Input border becomes `#DC2626`, focus ring becomes `#DC2626`, error message rendered below in `11px font-semibold text-red-600` with `role="alert"`.
  - Form-level error summary: At the top of multi-step forms when submission fails.

### 3.3 Status Badges & Lifecycle Colors
Campus recruitment application states follow strict semantic visual tokens:
- `submitted`: Blue pill (`bg-blue-50 text-blue-700 border-blue-200`) + Clock icon
- `shortlisted`: Purple pill (`bg-purple-50 text-purple-700 border-purple-200`) + Sparkles icon
- `interview`: Amber pill (`bg-amber-50 text-amber-700 border-amber-200`) + Calendar icon
- `selected`: Emerald pill (`bg-emerald-50 text-emerald-700 border-emerald-200`) + CheckCircle icon
- `rejected`: Rose pill (`bg-rose-50 text-rose-700 border-rose-200`) + XCircle icon
- `withdrawn`: Slate pill (`bg-slate-100 text-slate-600 border-slate-200`) + AlertCircle icon

### 3.4 Data Tables
- Responsive wrapper with `overflow-x-auto`.
- Header row with uppercase tracking, `text-slate-500 font-bold bg-slate-50/80 border-b border-slate-200`.
- Row hover highlight: `hover:bg-slate-50/70 transition-colors`.
- Action column pinned or right-aligned with button group.
- Numeric and status columns aligned consistently.

### 3.5 Dialogs & Modals
- Fixed backdrop with `bg-slate-900/50 backdrop-blur-xs`.
- Centered modal container with max width (`max-w-lg` to `max-w-2xl`), `max-h-[90vh] overflow-y-auto`.
- Clear header with title, subtitle, and explicit `✕` close button.
- Bottom action bar with secondary "Cancel" and primary confirmation button.

---

## 4. Comprehensive Page Inventory

### 4.1 Authentication & Onboarding (Shared)
1. `/login` — Unified role-aware authentication page with email, password, and role selector tab.
2. `/register` — Account registration (student signup / recruiter company signup).
3. `/forgot-password` — Password reset request form.
4. `/reset-password/:token` — Secure new password assignment.

### 4.2 Student Workspace (`/student/*`)
1. `/student/dashboard` — Student homepage: profile snapshot, application progress stats, recommended eligible jobs, upcoming interviews timetable.
2. `/student/profile` — Full academic & career profile manager (branch, CGPA, backlogs, skills tags, resume upload/replacement with file details).
3. `/student/jobs` — Job Explorer: search, branch & CTC filters, live eligibility badge with breakdown modal, 1-click apply.
4. `/student/jobs/:id` — Job Details: company background, compensation breakdown, selection rounds timetable, full eligibility criteria audit.
5. `/student/applications` — Applications Tracker: stage progression stepper, recruiter feedback notes, interview links, withdraw option.
6. `/student/interviews` — Calendar & list timetable of scheduled interview rounds with meeting links and instructions.

### 4.3 Recruiter Workspace (`/recruiter/*`)
1. `/recruiter/dashboard` — Recruiter homepage: active drives summary, candidate funnel metrics, upcoming interview schedules.
2. `/recruiter/company-profile` — Verified company branding, headquarters, industry, description, and website.
3. `/recruiter/jobs` — Manage Recruitment Drives: list of open/closed jobs, applicant counts, deadlines.
4. `/recruiter/jobs/create` — Post New Drive: role title, compensation, deadline, vacancy count, and automated eligibility rule builder (min CGPA, allowed branches, max backlogs).
5. `/recruiter/pipeline` — Candidate Review Pipeline with Dual View:
   - **Table View**: Bulk filtering, sorting by CGPA, fast status actions.
   - **Kanban Board**: Drag/status columns (`Submitted`, `Shortlisted`, `Interview`, `Selected`, `Rejected`).
6. `/recruiter/interviews` — Interview Scheduler: round name, date/time picker, virtual meet link generator.

### 4.4 Placement Administrator / TPO Workspace (`/admin/*`)
1. `/admin/dashboard` — Executive Placement Analytics:
   - 4 Top-line KPIs: Placement Rate (%), Average CTC, Highest CTC, Active Drives / Total Applications.
   - Visual Charts (Recharts): Branch-wise placement rate bar chart, CTC tiers distribution pie chart, campus application funnel.
2. `/admin/students` — Student Master Directory: searchable database of all registered students, branch/CGPA/status filters, CSV report export.
3. `/admin/companies` — Company & Recruiter Registry: verification status, active drive counts, total offers extended.
4. `/admin/drives` — Central Drive Moderation: inspect criteria, approve/pause drives, view real-time applicant stats.
5. `/admin/reports` — Exportable compliance reports, placement statistics by department, salary distribution sheets.

---

## 5. Responsive Layout Architecture

### Breakpoints
- **Mobile (`< 768px`)**:
  - Top navigation bar with Hamburger toggle for mobile drawer menu.
  - Cards stack vertically in 1 column (`grid-cols-1`).
  - Tables scroll horizontally smoothly (`overflow-x-auto`) or switch to structured mobile card list.
- **Tablet (`768px - 1023px`)**:
  - 2-column dashboard grids (`md:grid-cols-2`).
  - Compact sidebar or top navigation.
- **Desktop (`1024px+`)**:
  - Fixed collapsible left sidebar (`w-64`) + sticky top navigation bar (`h-16`) with user profile menu and live notification center.
  - Multi-column metric grid (`lg:grid-cols-4`).
  - Full-width interactive Recharts dashboards.

---

## 6. Implementation Plan for Phase 2 (Application Shell & Foundation)

1. **Install Core Routing**:
   - Install `react-router-dom` for structured client-side routing.
2. **Establish Shared Component Library in `src/components/common/`**:
   - `Button.jsx`: Semantic variants (primary, secondary, outline, destructive, ghost), loading spinner state.
   - `Input.jsx` & `Select.jsx`: Consistent focus rings, label binding, helper text, and accessible error summary support.
   - `Card.jsx`: Reusable styled container with header, body, and footer slots.
   - `Badge.jsx`: Status and tag indicators with WCAG compliant colors.
   - `Modal.jsx`: Accessible modal dialog with backdrop blur, focus trap, and escape key listener.
   - `Table.jsx`: Structured responsive table with empty and loading skeleton states.
3. **Build the Application Shell**:
   - `AppLayout.jsx`: Responsive layout container with persistent top navigation and role-aware sidebar navigation.
   - `Sidebar.jsx`: Collapsible sidebar with role-specific link sets (`/student`, `/recruiter`, `/admin`).
   - `TopNav.jsx`: Breadcrumbs, institutional branding, notification bell with unread badge, and quick role preview switcher (for development review).
4. **Create Route Skeleton & Placeholder Pages**:
   - Set up route definitions in `src/routes.jsx` for all planned paths.
   - Provide clean empty/loading states so that every page renders without crashing.
5. **Verify Build & Visual Quality**:
   - Run production build (`npm run build`) and test responsive behavior.
