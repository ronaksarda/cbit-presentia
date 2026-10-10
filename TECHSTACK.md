# Praesentia — Technology Stack

> **Status:** Locked architecture baseline  
> **Version:** 2.0  
> **Product:** Praesentia — College Academic & Attendance Management System  
> **Architecture:** Modular monolith with a React web client and FastAPI backend  
> **Primary deployment target:** India / Mumbai region where supported  
> **Cost objective:** Free/near-zero for development and early deployments; production cost may increase when required for backups, reliability, security, or institutional scale

---

## 1. Purpose

This document defines the approved technology stack for Praesentia.

It is intentionally strict. Technology choices should not be changed casually during implementation.

Praesentia is an institutional academic system, not a prototype dashboard. The stack therefore prioritizes:

1. Security
2. Academic data integrity
3. Correct authorization
4. Privacy
5. Reliability
6. Maintainability
7. Performance
8. Accessibility
9. Developer productivity
10. Cost efficiency

**Cost optimization must never override security, authorization, academic correctness, backups, or reliability.**

---

# 2. Final Stack

| Layer | Technology | Decision |
|---|---|---|
| Web application | React | **Required** |
| Language | TypeScript | **Required** |
| Build tool | Vite | **Required** |
| Styling | Tailwind CSS | **Required** |
| UI components | shadcn/ui | **Required** |
| Icons | Phosphor Icons | **Required** |
| Server state | TanStack Query | **Required** |
| Forms | React Hook Form | **Required** |
| Schema validation | Zod | **Required** |
| Charts | Recharts / shadcn Chart patterns | **Required** |
| Routing | React Router | **Required** |
| Backend API | FastAPI | **Required** |
| Backend language | Python | **Required** |
| API/data validation | Pydantic | **Required** |
| ORM | SQLAlchemy 2.x | **Required** |
| Database migrations | Alembic | **Required** |
| Database | PostgreSQL | **Required** |
| Authentication | Supabase Auth | **Required** |
| Database platform | Supabase | **Required** |
| Realtime | Supabase Realtime | **Required where needed** |
| File storage | Supabase Storage | **Required** |
| Frontend hosting | Cloudflare Pages | **Preferred** |
| Backend hosting | Google Cloud Run | **Preferred** |
| Backup storage | Backblaze B2 | **Preferred** |
| Backend tests | Pytest + HTTPX | **Required** |
| Frontend tests | Vitest + React Testing Library | **Required** |
| E2E tests | Playwright | **Required before production** |
| API documentation | FastAPI OpenAPI | **Required** |
| Package management | npm | **Required for frontend** |
| Python environment | `venv` + pinned dependencies | **Required** |
| Cache | None initially | **Deliberate** |
| Redis | None initially | **Deliberate** |
| Message queue | None initially | **Deliberate** |
| Celery | None initially | **Deliberate** |
| Microservices | None initially | **Deliberate** |
| Kubernetes | None initially | **Deliberate** |

---

# 3. Architecture

Praesentia will use a **modular monolith**, not microservices.

```text
                         PRAESENTIA
                              │
             ┌────────────────┴────────────────┐
             │                                 │
        WEB CLIENT                         API SERVER
             │                                 │
      React + TypeScript                  FastAPI + Python
      Vite                               Pydantic
      Tailwind CSS                       SQLAlchemy
      shadcn/ui                          Alembic
      Phosphor                           Business Logic
      TanStack Query                     Authorization
      React Hook Form                    Audit
      Zod
             │                                 │
             └────────────────┬────────────────┘
                              │
                         PostgreSQL
                              │
                          SUPABASE
                    ┌─────────┼─────────┐
                    │         │         │
                   Auth    Realtime   Storage

             ┌────────────────┴────────────────┐
             │                                 │
      Cloudflare Pages                   Google Cloud Run
         Frontend                            Backend
             │
             └──────────────┬──────────────────┘
                            │
                    Backblaze B2
                    Independent Backups
```

---

# 4. Why a Modular Monolith?

Praesentia does not need microservices at the beginning.

The system has tightly related academic workflows:

- students
- faculty
- courses
- attendance
- attendance corrections
- discrepancy requests
- materials
- announcements
- timetable
- academic performance
- feedback
- notifications
- audit history

These domains require strong transactional consistency and authorization.

Splitting them into independent services too early would add:

- deployment complexity
- networking complexity
- authentication duplication
- distributed transaction problems
- observability overhead
- higher infrastructure cost
- more failure modes

Therefore:

> **One backend application, internally divided into strict domain modules.**

Possible backend structure:

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── auth/
│   ├── users/
│   ├── students/
│   ├── faculty/
│   ├── courses/
│   ├── attendance/
│   ├── discrepancies/
│   ├── materials/
│   ├── announcements/
│   ├── timetable/
│   ├── academics/
│   ├── feedback/
│   ├── notifications/
│   ├── audit/
│   └── reports/
├── tests/
├── alembic/
└── pyproject.toml
```

The exact folder layout may evolve, but domain boundaries must remain explicit.

---

# 5. Frontend

## 5.1 React

**React is the required frontend framework.**

Why:

- mature ecosystem
- strong TypeScript support
- component-based architecture
- excellent form and data-fetching ecosystem
- suitable for complex authenticated applications
- large developer ecosystem
- no framework license cost

Praesentia is an application-first product, so React is preferable to introducing a larger full-stack framework that is not required.

---

## 5.2 TypeScript

**TypeScript is mandatory.**

JavaScript-only development is not permitted for Praesentia's application code.

TypeScript provides:

- compile-time type checking
- safer API contracts
- safer component interfaces
- better refactoring
- improved IDE support
- fewer runtime errors caused by shape mismatches

Avoid using `any` unless there is a documented and justified reason.

---

## 5.3 Vite

**Vite is the required frontend build tool.**

Reasons:

- fast local development
- fast HMR
- simple configuration
- excellent React + TypeScript support
- static deployment compatibility
- no unnecessary server framework overhead

The frontend is not dependent on server-side rendering, so a dedicated SSR framework is not required.

---

# 6. Styling and UI

## 6.1 Tailwind CSS

Tailwind CSS is the required styling foundation.

Use it for:

- layout
- spacing
- responsive behavior
- typography
- state styling
- design tokens
- responsive utilities

Do not create arbitrary CSS for every component.

Custom CSS is allowed when it is genuinely required by the design system or a domain-specific interaction.

---

## 6.2 shadcn/ui

**shadcn/ui is the required standard component system.**

Use shadcn/ui for standard interface primitives such as:

- Button
- Input
- Select
- Checkbox
- Radio Group
- Switch
- Dialog
- Alert Dialog
- Sheet
- Drawer
- Dropdown Menu
- Popover
- Tooltip
- Tabs
- Table
- Card
- Badge
- Calendar
- Toast / Sonner
- Skeleton
- Command
- Form primitives

Do not replace shadcn components with unrelated UI libraries.

Do not introduce multiple competing component systems.

Custom components are allowed only when the interaction is genuinely Praesentia-specific.

---

## 6.3 Icons

**Phosphor Icons are the required icon library.**

Do not use:

- Lucide
- emoji as UI icons
- arbitrary Unicode symbols as interface icons
- random icon packages

Icons must have consistent sizing, weight, alignment, and semantic meaning.

---

# 7. Client State and Data Fetching

## 7.1 TanStack Query

TanStack Query is the required server-state layer.

Use it for:

- API requests
- caching
- request deduplication
- loading states
- error states
- refetching
- invalidation
- optimistic updates where safe
- synchronization of server data

Do not duplicate server data unnecessarily in React state.

---

## 7.2 Local UI State

React state should be used for genuinely local UI state:

- open/closed dialogs
- selected tabs
- temporary form state
- local filters
- visual preferences

Do not turn the entire application into a global client-state store without a demonstrated need.

A global state library such as Redux/Zustand is **not required initially**.

Add one only if a concrete architectural need appears.

---

# 8. Forms and Validation

## 8.1 React Hook Form

React Hook Form is the standard for complex forms.

Use it for:

- authentication forms
- profile forms
- attendance workflows
- discrepancy requests
- material upload metadata
- announcements
- feedback
- administrative forms

---

## 8.2 Zod

Zod is the frontend schema-validation layer.

Use it for:

- form validation
- input validation
- parsing external data where appropriate
- enforcing UI-level schemas

Important:

> Frontend Zod validation is not a security boundary.

Every security-sensitive validation rule must also exist on the backend.

---

# 9. Backend

## 9.1 FastAPI

**FastAPI is the required backend framework.**

Why:

- Python ecosystem
- strong type integration
- Pydantic integration
- automatic OpenAPI documentation
- asynchronous support
- good performance
- straightforward dependency injection
- excellent testing support
- no license cost

FastAPI is responsible for:

- business logic
- authorization
- validation
- academic rules
- transactional workflows
- audit logging
- report generation
- controlled integration with Supabase
- secure API exposure

---

## 9.2 Pydantic

Pydantic is mandatory for backend request/response validation.

Every API endpoint should define explicit schemas.

Do not accept arbitrary JSON dictionaries for security-sensitive operations.

Example conceptual flow:

```text
HTTP Request
     ↓
Authentication
     ↓
Authorization
     ↓
Pydantic validation
     ↓
Business rules
     ↓
Database transaction
     ↓
Audit
     ↓
Response schema
```

---

# 10. Database

## 10.1 PostgreSQL

**PostgreSQL is the primary database.**

This is a deliberate choice.

Praesentia contains highly relational academic data:

```text
Institution
   ↓
Department
   ↓
Program
   ↓
Semester
   ↓
Section
   ↓
Course
   ↓
Faculty Assignment
   ↓
Student Enrollment
   ↓
Attendance
```

Additional relationships include:

- students ↔ courses
- faculty ↔ courses
- faculty ↔ sections
- attendance ↔ lectures
- discrepancies ↔ attendance records
- materials ↔ courses
- announcements ↔ courses/sections
- feedback ↔ courses/faculty
- audit events ↔ users/actions/entities

PostgreSQL provides:

- ACID transactions
- foreign keys
- constraints
- indexes
- unique constraints
- row-level security
- strong consistency
- mature tooling

MongoDB is therefore **not part of the approved stack**.

---

# 11. ORM

## SQLAlchemy 2.x

SQLAlchemy is the required database access layer.

Use it for:

- models
- relationships
- transactions
- query construction
- parameterized database operations

Do not construct SQL using unsafe string interpolation.

Raw SQL is permitted when it provides a real advantage, but it must remain parameterized and reviewed.

---

# 12. Database Migrations

## Alembic

Alembic is required for schema migrations.

Rules:

- every schema change must have a migration
- migrations must be reviewed
- destructive migrations require explicit consideration
- production migrations must be backward-compatible where practical
- never manually modify production schema as a substitute for migrations
- migration history must remain reproducible

---

# 13. Supabase

Supabase is the managed PostgreSQL platform around the core database.

Praesentia will use:

### Supabase PostgreSQL
Primary application database.

### Supabase Auth
Authentication and identity management.

### Supabase Realtime
Realtime academic updates where they materially improve the workflow.

### Supabase Storage
Private academic file storage.

Supabase is a platform dependency, not a replacement for backend authorization.

---

# 14. Authentication

## Supabase Auth + FastAPI Authorization

Authentication and authorization are separate concerns.

```text
Student / Faculty
       ↓
Supabase Auth
       ↓
Authenticated identity
       ↓
JWT
       ↓
FastAPI verifies identity
       ↓
FastAPI determines role
       ↓
FastAPI checks object-level permissions
       ↓
Database operation
```

The frontend must never decide whether a user is allowed to access academic data.

---

# 15. Authorization

Authorization is enforced in layers.

### Layer 1 — Authentication

Is the user authenticated?

### Layer 2 — Role authorization

Is the user:

- student?
- faculty?
- administrator?

### Layer 3 — Object-level authorization

Does the user actually have access to this:

- student?
- course?
- section?
- attendance record?
- material?
- announcement?
- discrepancy?
- report?

### Layer 4 — Database protection

PostgreSQL/Supabase RLS and database permissions provide an additional protection layer where applicable.

---

# 16. Row-Level Security

RLS is part of the security architecture.

For exposed application tables:

- RLS must be deliberately enabled
- policies must be explicit
- anonymous access must be denied unless explicitly required
- authenticated access must be scoped
- policies must be tested for both allowed and denied cases

RLS is not a substitute for FastAPI authorization.

It is defense in depth.

---

# 17. Secrets

The frontend must never contain:

- Supabase service-role keys
- database passwords
- backend secrets
- signing secrets
- private API keys
- administrative credentials

Public client configuration may be exposed only when the underlying platform explicitly considers it safe and the corresponding authorization controls are correctly configured.

Secrets belong in server-side environment/secret management.

---

# 18. Attendance Data Architecture

Attendance is official academic data.

The stack must support:

- atomic attendance submission
- transactional updates
- idempotent operations
- correction workflows
- audit history
- concurrency protection
- faculty authorization
- student read-only access
- discrepancy workflows

A student must never be able to directly modify attendance through the client.

A faculty member must never be able to modify attendance outside their authorized course/section scope.

---

# 19. Realtime

Supabase Realtime may be used for:

- attendance updates
- discrepancy status updates
- announcements
- notifications
- relevant dashboard refreshes

Realtime is **not a separate trust boundary**.

The same authorization rules that protect API/database access must protect realtime data.

Realtime should not be used everywhere merely because it is available.

Use it where it provides a meaningful user experience improvement.

---

# 20. File Storage

Supabase Storage is the default file-storage layer.

Expected files include:

- PDFs
- PPT/PPTX
- documents
- course notes
- lab manuals
- reference material
- academic resources

Files are treated as untrusted input.

Required protections include:

- private buckets where appropriate
- authenticated access
- authorization checks
- signed URLs where appropriate
- file-type validation
- size limits
- safe filenames
- path traversal protection
- metadata validation
- controlled download access

Do not expose private academic files through permanent public URLs.

---

# 21. Frontend Hosting

## Cloudflare Pages

Cloudflare Pages is the preferred frontend hosting platform.

Why:

- strong fit for Vite/static React applications
- Git-based deployments
- preview deployments
- global edge delivery
- low operational complexity
- free starting tier

The frontend should remain deployable as a static application.

---

# 22. Backend Hosting

## Google Cloud Run

Cloud Run is the preferred backend hosting platform.

Why:

- containerized FastAPI deployment
- automatic scaling
- HTTPS
- low operational overhead
- suitable for a modular monolith
- free starting tier within applicable limits
- India region availability

The backend should be packaged as a production container.

Do not introduce Kubernetes for the initial system.

---

# 23. Backups

## Backblaze B2

Backblaze B2 is the preferred independent backup destination for small-scale deployments.

The purpose is to avoid relying exclusively on the primary database provider for disaster recovery.

Backups should be:

- encrypted
- versioned where appropriate
- access-controlled
- independently stored
- periodically tested

A backup that has never been restored is not considered proven.

---

# 24. Caching

## No Redis initially

Redis is intentionally excluded from the initial stack.

Reasons:

- adds infrastructure
- adds another network dependency
- adds operational overhead
- is not required for the initial workload

Start with:

- PostgreSQL indexes
- efficient SQL
- TanStack Query client caching
- HTTP caching where appropriate
- connection pooling
- proper pagination

Add Redis only after a measured bottleneck or a clearly justified requirement.

---

# 25. Background Jobs

## No Celery initially

Celery and a message broker are not required for the initial system.

Avoid introducing:

```text
FastAPI
   ↓
Celery
   ↓
Redis/RabbitMQ
```

unless asynchronous workloads genuinely require it.

For small workloads, use:

- normal API operations
- database transactions
- Cloud Run-compatible execution
- carefully designed scheduled jobs where required

If future workloads require durable asynchronous processing, introduce a queue based on measured requirements rather than prematurely.

---

# 26. Microservices

Microservices are explicitly **not** part of the initial architecture.

Do not split Praesentia into:

- auth-service
- attendance-service
- course-service
- notification-service
- material-service
- analytics-service

unless scale or organizational requirements actually justify it.

The modular monolith must have clean internal boundaries so that future extraction remains possible.

---

# 27. Testing

Testing is mandatory.

## Frontend

### Vitest
Unit and component tests.

### React Testing Library
User-facing component behavior.

### Playwright
End-to-end workflows.

Critical E2E flows include:

- login
- logout
- student dashboard
- faculty dashboard
- attendance marking
- attendance submission
- attendance correction
- discrepancy request
- discrepancy review
- material access
- authorization failures
- session behavior

---

## Backend

### Pytest
Unit and integration tests.

### HTTPX
API testing.

Test:

- authentication
- authorization
- validation
- business rules
- transactions
- attendance integrity
- discrepancy workflows
- audit behavior
- error handling

---

# 28. Security Testing

Security tests are first-class tests.

At minimum test:

- unauthenticated requests
- wrong-role requests
- cross-user access
- cross-course access
- cross-section access
- modified object IDs
- malformed payloads
- oversized payloads
- replayed requests where relevant
- duplicate attendance submissions
- concurrent attendance updates
- unauthorized file access
- expired sessions
- invalid tokens
- rate-limit behavior
- RLS allow/deny behavior

A successful UI interaction is not evidence that authorization is correct.

---

# 29. API Contract

FastAPI's OpenAPI specification is the canonical API contract.

Requirements:

- explicit request models
- explicit response models
- stable error shapes
- consistent status codes
- documented authentication requirements
- documented authorization requirements
- versioned breaking changes

Frontend code should consume the backend contract rather than inventing API shapes independently.

---

# 30. Error Handling

The system must distinguish between:

- validation errors
- authentication failures
- authorization failures
- missing resources
- business-rule violations
- conflicts
- rate limits
- server failures
- dependency failures

Do not expose:

- stack traces
- SQL errors
- secrets
- internal infrastructure details
- sensitive database information

to users.

Logs may contain diagnostic information, but sensitive data must be minimized.

---

# 31. Observability

Initial observability should remain lightweight.

Use:

- structured application logs
- request IDs / correlation IDs
- error logging
- health endpoints
- deployment logs
- database monitoring
- provider monitoring

Do not introduce a large observability platform before there is a demonstrated need.

---

# 32. Performance Principles

Performance optimization should start with architecture, not additional infrastructure.

Priority order:

1. correct database schema
2. correct indexes
3. efficient queries
4. pagination
5. selective data loading
6. TanStack Query caching
7. connection pooling
8. frontend code splitting
9. asset optimization
10. measured caching
11. additional infrastructure only if necessary

Do not add Redis, Elasticsearch, Kafka, or other infrastructure merely to appear scalable.

---

# 33. Mobile-First Architecture

Praesentia is a mobile-first responsive web application.

The stack must support:

- small-screen layouts
- touch-friendly controls
- responsive tables
- responsive dialogs/sheets
- accessible forms
- mobile navigation
- low-bandwidth-friendly loading
- progressive content loading

This is a responsive web application.

It is **not a native Android/iOS application** in the initial architecture.

---

# 34. Accessibility

Accessibility is part of the implementation.

Required considerations:

- keyboard navigation
- visible focus states
- semantic HTML
- accessible labels
- sufficient contrast
- screen-reader-compatible controls
- accessible dialogs
- accessible form errors
- non-color-only status indicators
- touch target sizing

Do not rely on color alone for:

- attendance status
- warnings
- errors
- success states
- academic alerts

---

# 35. Dependency Policy

Every dependency must have a reason.

Before adding a package, ask:

1. Is it actually necessary?
2. Does the current stack already solve the problem?
3. Is it actively maintained?
4. Is its license acceptable?
5. Does it introduce security risk?
6. Does it duplicate existing functionality?
7. Does it materially increase bundle size?
8. Does it create another architectural dependency?

Do not add packages for trivial functionality.

---

# 36. Explicitly Rejected Technologies

The following are not approved for the initial Praesentia architecture:

### Frontend

- Next.js
- Angular
- Vue
- Redux unless later justified
- multiple component libraries
- multiple icon libraries

### Backend

- Django
- Flask
- Node/Express
- NestJS

### Database

- MongoDB as primary database
- Firebase/Firestore as primary database
- multiple primary databases

### Infrastructure

- Kubernetes
- Docker Swarm
- Redis
- RabbitMQ
- Kafka
- Celery
- Elasticsearch

These are not inherently bad technologies.

They are simply unnecessary for the initial Praesentia architecture.

---

# 37. Why Not Next.js?

Next.js is capable of building Praesentia, but it is not required.

Praesentia already has:

```text
React frontend
        +
FastAPI backend
```

Introducing Next.js would add another application framework without solving a necessary problem.

The application does not require server-rendered public marketing pages as a core product requirement.

Vite + React keeps the frontend simple and cleanly separated from the API.

---

# 38. Why Not Firebase?

Firebase is not the preferred platform because Praesentia's core data is highly relational and academically transactional.

PostgreSQL is a better fit for:

- relational integrity
- foreign keys
- attendance transactions
- constraints
- reporting
- academic relationships
- audit data
- complex authorization conditions

---

# 39. Why Not MongoDB?

MongoDB is not the preferred primary database because the core model is relational.

Examples:

```text
Student → Enrollment → Course
Faculty → Assignment → Course
Student → Attendance → Lecture
Student → Discrepancy → Attendance
Course → Material
Course → Announcement
```

PostgreSQL represents these relationships naturally and enforces integrity at the database level.

---

# 40. Cost Strategy

The goal is **near-zero cost without compromising security**.

### Development

Target:

```text
$0
```

Use free/open-source tooling and free infrastructure tiers.

### Demo / small deployment

Target:

```text
Near $0
```

subject to provider limits.

### Real institutional deployment

Do not force production infrastructure to remain free if doing so removes:

- automatic backups
- reliable recovery
- sufficient database resources
- required retention
- operational reliability

The architecture should remain the same while infrastructure plans are upgraded.

> **Free infrastructure is a cost optimization, not a security guarantee.**

---

# 41. Production Infrastructure Principle

For real academic records, the system must have a credible disaster-recovery strategy.

If the free database tier does not provide sufficient:

- backups
- retention
- compute
- storage
- reliability
- recovery guarantees

then the appropriate paid plan must be used.

Do not weaken academic data protection to preserve a $0 deployment.

---

# 42. Environment Strategy

At minimum:

```text
Development
     ↓
Staging
     ↓
Production
```

Development and production must never share:

- secrets
- databases
- storage buckets
- authentication environments

Production credentials must never be committed to Git.

---

# 43. Configuration

Configuration belongs in environment-specific configuration.

Example categories:

```text
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
JWT / AUTH configuration
CORS configuration
STORAGE configuration
APPLICATION_ENV
```

Sensitive values must never be hardcoded.

The service-role key is backend-only.

---

# 44. Repository Structure

A practical top-level structure:

```text
praesentia/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── tests/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   ├── tests/
│   ├── alembic/
│   ├── pyproject.toml
│   └── Dockerfile
│
├── docs/
├── .agents/
├── AGENTS.md
├── DESIGN.md
├── PROJECT_RULES.md
├── STUDENT_FEATURES.md
├── FACULTY_FEATURES.md
└── TECHSTACK.md
```

The exact repository layout may evolve, but frontend/backend separation and documentation boundaries should remain clear.

---

# 45. Development Rules

### Rule 1
Do not change the approved stack because another technology is fashionable.

### Rule 2
Do not add infrastructure before proving that it is necessary.

### Rule 3
Do not move security logic into the frontend.

### Rule 4
Do not bypass FastAPI business logic for convenience.

### Rule 5
Do not expose service-role or secret credentials.

### Rule 6
Do not directly mutate academic records from the client.

### Rule 7
Do not bypass RLS or authorization because a query is inconvenient.

### Rule 8
Do not add a second database without architectural approval.

### Rule 9
Do not add a second UI component library.

### Rule 10
Every dependency must justify its existence.

---

# 46. Recommended Implementation Order

The technology should be implemented in this order.

## Phase 1 — Foundation

- repository setup
- React + TypeScript + Vite
- Tailwind
- shadcn/ui
- Phosphor
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic
- PostgreSQL/Supabase
- environment configuration
- CI checks
- base testing infrastructure

## Phase 2 — Identity

- Supabase Auth
- login
- sessions
- roles
- JWT verification
- FastAPI authentication dependencies
- initial RLS
- authorization tests

## Phase 3 — Academic Core

- institutions
- departments
- programs
- semesters
- sections
- users
- students
- faculty
- courses
- enrollments
- faculty-course assignments

## Phase 4 — Attendance

- attendance records
- lecture/session records
- faculty attendance workflow
- atomic submission
- audit logging
- student attendance views
- correction workflow
- discrepancy workflow

## Phase 5 — Academic Features

- materials
- announcements
- timetable
- academic performance
- feedback
- notifications

## Phase 6 — Realtime

Introduce realtime only for workflows that benefit from it.

## Phase 7 — Production Hardening

- E2E testing
- security testing
- rate limits
- backup verification
- restore testing
- observability
- performance testing
- deployment hardening

---

# 47. Definition of a Stack-Compliant Feature

A feature is not considered complete merely because its UI works.

A stack-compliant feature must consider:

```text
UI
 ↓
API Contract
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Business Rules
 ↓
Transaction
 ↓
Database Constraints
 ↓
RLS / Defense in Depth
 ↓
Audit
 ↓
Error Handling
 ↓
Tests
 ↓
Mobile Experience
```

For sensitive academic features, all layers must be implemented.

---

# 48. Final Technology Decision

Praesentia will use:

```text
React
+ TypeScript
+ Vite
+ Tailwind CSS
+ shadcn/ui
+ Phosphor Icons
+ TanStack Query
+ React Hook Form
+ Zod
+ Recharts
        │
        ▼
FastAPI
+ Python
+ Pydantic
+ SQLAlchemy 2.x
+ Alembic
        │
        ▼
PostgreSQL
        │
        ▼
Supabase
├── Auth
├── PostgreSQL
├── Realtime
└── Storage

Deployment:
├── Cloudflare Pages
├── Google Cloud Run
└── Backblaze B2
```

This is the **approved baseline architecture**.

Changes require a concrete technical reason, not preference or trend.

---

# 49. Non-Negotiable Principle

> **Use the simplest architecture that can securely preserve academic truth at the required scale.**

Praesentia should not become technically impressive by accumulating infrastructure.

It should become reliable by making every layer:

- explicit
- secure
- testable
- observable
- maintainable
- authorized
- consistent
- cost-conscious

**Security and academic data integrity always outrank infrastructure cost or implementation convenience.**


---

# 50. Architecture Refinement — What This Stack Actually Includes

The technology list is only one part of the architecture.

Praesentia is approved as a **secure modular monolith with explicit domain boundaries, centralized authorization, transactional application services, PostgreSQL as the source of truth, and Supabase as the managed platform layer**.

The intended architecture is:

```text
                           CLIENT
                             │
                  React + TypeScript
                             │
                TanStack Query / Forms
                             │
                       HTTPS / JSON
                             │
                             ▼
                    ┌─────────────────┐
                    │     FastAPI     │
                    │     API Layer   │
                    └────────┬────────┘
                             │
                 Authentication Context
                             │
                             ▼
                    Authorization Layer
                             │
                             ▼
                    Application Services
                             │
                             ▼
                     Domain Services
                             │
                    ┌────────┴────────┐
                    │                 │
             Repository Layer     Audit Layer
                    │                 │
                    └────────┬────────┘
                             │
                             ▼
                       SQLAlchemy 2.x
                             │
                             ▼
                        PostgreSQL
                             │
                  ┌──────────┼──────────┐
                  │          │          │
                 RLS       Storage    Realtime
                  │          │          │
                  └──────────┴──────────┘
```

No layer may silently bypass the layer beneath it.

---

# 51. Backend Layering Contract

FastAPI route handlers must remain thin.

A route should not contain the complete business workflow.

Preferred:

```text
Router
  ↓
Request schema
  ↓
Authentication dependency
  ↓
Authorization policy
  ↓
Application service
  ↓
Domain rules
  ↓
Repository / SQLAlchemy
  ↓
Transaction
  ↓
Audit
  ↓
Response schema
```

Avoid:

```text
Router
  ↓
300 lines of business logic
  ↓
random database queries
```

This rule exists to keep authorization, business rules, transactions, and tests consistent.

---

# 52. Domain Boundaries

The backend should be organized around business domains.

Required initial domains:

```text
core
auth
institutions
users
students
faculty
academics
courses
enrollments
attendance
discrepancies
materials
announcements
timetable
performance
feedback
notifications
audit
reports
```

Each domain should have clear responsibilities.

For example:

```text
attendance/
├── router.py
├── schemas.py
├── models.py
├── repository.py
├── service.py
├── policies.py
├── rules.py
└── tests/
```

Not every domain needs every file, but the separation between transport, authorization, business rules, persistence, and tests must remain understandable.

---

# 53. Source-of-Truth Contract

The authoritative source of truth is PostgreSQL.

The following are never authoritative in browser state:

- attendance percentages
- grades
- SGPA
- CGPA
- enrollment
- faculty assignment
- timetable
- academic status
- permissions
- discrepancy state
- correction state

The frontend may display derived values, but the backend must either:

1. calculate them from authoritative records, or
2. retrieve an authoritative stored value.

Client-calculated values are presentation aids only.

---

# 54. API Design Contract

The API should follow resource-oriented conventions.

Examples:

```text
GET    /api/v1/me
GET    /api/v1/student/dashboard
GET    /api/v1/student/attendance
GET    /api/v1/student/courses

GET    /api/v1/faculty/courses
GET    /api/v1/faculty/courses/{course_id}/students

POST   /api/v1/attendance/sessions
PATCH  /api/v1/attendance/sessions/{session_id}/draft
POST   /api/v1/attendance/sessions/{session_id}/submit

POST   /api/v1/attendance/corrections
GET    /api/v1/attendance/corrections

POST   /api/v1/discrepancies
GET    /api/v1/discrepancies
POST   /api/v1/discrepancies/{id}/approve
POST   /api/v1/discrepancies/{id}/reject
```

The exact route names may evolve, but the API must remain:

- versioned
- predictable
- authorization-aware
- explicitly validated
- consistently error-shaped

Do not expose database table names directly as an accidental API design.

---

# 55. API Versioning

Initial public API prefix:

```text
/api/v1
```

Breaking API changes require a deliberate versioning strategy.

Do not silently change:

- field meaning
- authorization semantics
- response types
- required request fields
- enum meanings

without updating affected clients and tests.

---

# 56. HTTP Semantics

Use HTTP status codes consistently.

Recommended baseline:

```text
200  Successful read/update
201  Successful creation
204  Successful deletion/action with no body
400  Invalid request
401  Unauthenticated
403  Authenticated but unauthorized
404  Resource not found / intentionally indistinguishable resource
409  State/conflict violation
422  Schema validation failure where appropriate
429  Rate limited
500  Unexpected server failure
502/503 Dependency/service failure where appropriate
```

Do not return `200` for a failed academic operation.

---

# 57. Error Contract

All API errors should use a predictable shape.

Conceptual structure:

```json
{
  "error": {
    "code": "ATTENDANCE_ALREADY_SUBMITTED",
    "message": "Attendance has already been submitted.",
    "request_id": "..."
  }
}
```

Rules:

- error codes are stable
- messages are safe for users
- internal exceptions are not exposed
- request IDs allow support/debugging
- sensitive information is never included

Frontend code should branch on stable error codes where business behavior depends on the error.

---

# 58. Authentication Architecture

Supabase Auth is responsible for identity.

FastAPI is responsible for trusting that identity only after verification.

The application must establish a normalized authenticated principal:

```text
AuthenticatedPrincipal
├── user_id
├── institution_id
├── role
├── status
└── auth/session context
```

Every protected request must operate from this trusted server-side principal.

Never accept:

```json
{
  "role": "FACULTY",
  "student_id": "..."
}
```

as evidence of authority.

The authenticated identity determines who the caller is.

The database determines what the caller may access.

---

# 59. User and Academic Identity Model

Authentication identity and academic identity must remain conceptually separate.

Example:

```text
Auth User
   │
   └── User Profile
          │
          ├── Student Profile
          │      ├── roll number
          │      ├── program
          │      ├── section
          │      └── academic status
          │
          └── Faculty Profile
                 ├── employee ID
                 ├── department
                 └── designation
```

This avoids making authentication credentials the authoritative academic record.

---

# 60. Institution Multi-Tenancy Boundary

The architecture must support institutional isolation even if the first deployment serves only one college.

Core records should carry or derive an institution boundary.

Conceptually:

```text
institution_id
      ↓
department
      ↓
program
      ↓
academic period
      ↓
section
      ↓
course
      ↓
enrollment / assignment
```

Every sensitive query must respect institution boundaries.

A user from Institution A must never be able to access Institution B merely by changing an identifier.

---

# 61. Academic Period Model

Academic data must be associated with explicit academic periods.

At minimum the model should be capable of representing:

```text
Academic Year
    ↓
Term / Semester
    ↓
Section
    ↓
Course Offering
```

Historical records must remain interpretable after students advance to another semester.

Do not derive historical academic meaning solely from the user's current semester.

---

# 62. Course Offering vs Course Definition

Separate the reusable academic course definition from a specific offering.

Conceptually:

```text
Course
├── code
├── name
├── credits
└── description

Course Offering
├── course_id
├── academic_period_id
├── section_id
├── faculty assignment(s)
└── schedule
```

Attendance, enrollment, announcements, and materials should normally attach to the relevant offering rather than an abstract course definition.

This prevents historical data from changing when the same course is taught again.

---

# 63. Enrollment Model

Student access should be based on explicit enrollment.

Conceptually:

```text
Student
   ↓
Enrollment
   ↓
Course Offering
   ↓
Section
```

Do not infer access merely because:

- the student knows a course ID
- the student belongs to the same department
- the student has the same semester
- the student guesses a URL

Enrollment is the authoritative access relationship.

---

# 64. Faculty Assignment Model

Faculty access must be based on explicit assignment.

Conceptually:

```text
Faculty
   ↓
Faculty Course Assignment
   ↓
Course Offering
   ↓
Section
```

Authorization must evaluate this relationship.

A faculty role alone never grants access to every course.

---

# 65. Attendance Data Model

Attendance should distinguish at least:

```text
Attendance Session
    ├── course offering
    ├── section
    ├── date
    ├── scheduled start
    ├── scheduled end
    ├── status
    └── created/submitted metadata

Attendance Record
    ├── session
    ├── student
    ├── attendance status
    ├── recorded by
    └── timestamps
```

Do not store attendance as a single mutable percentage.

Percentage is derived from authoritative attendance records.

---

# 66. Attendance State Machine

Attendance sessions should have explicit states.

Example:

```text
DRAFT
  │
  ▼
READY_FOR_SUBMISSION
  │
  ▼
SUBMITTED
  │
  ├──► CORRECTION_PENDING
  │
  └──► LOCKED
```

The exact states may be simplified, but state transitions must be explicit.

Invalid transitions must be rejected server-side.

Example:

```text
LOCKED → DRAFT
```

must never succeed simply because a frontend button was exposed.

---

# 67. Attendance Idempotency

Final attendance submission must be idempotent.

A retry caused by:

- network failure
- double tap
- browser retry
- timeout
- client reconnect

must not create duplicate official records.

Use:

- unique database constraints
- explicit session identity
- idempotency keys where appropriate
- transaction boundaries

Do not rely on frontend button disabling alone.

---

# 68. Attendance Concurrency

Two faculty requests may arrive simultaneously.

The database must prevent:

```text
Request A → submit
Request B → submit
```

from creating two official submissions.

Use appropriate combinations of:

- transactions
- unique constraints
- row locks
- state checks
- optimistic concurrency

The correct mechanism should be selected per workflow rather than applied blindly.

---

# 69. Attendance Correction Architecture

A correction should be treated as a controlled academic event.

Conceptually:

```text
Existing official record
        ↓
Authorization
        ↓
Correction policy
        ↓
New status + reason
        ↓
Transaction
   ┌────┴─────────────┐
   ↓                  ↓
Current state      Audit history
   │
   ↓
Realtime notification
```

Never implement correction as an untracked:

```sql
UPDATE attendance
SET status = ...
```

without preserving the required audit information.

---

# 70. Discrepancy Architecture

Student discrepancy requests should have explicit states.

Example:

```text
SUBMITTED
   ↓
UNDER_REVIEW
   ├──► APPROVED
   ├──► REJECTED
   └──► NEEDS_INFORMATION
```

Approval must not directly perform an unauthorized database mutation.

Instead:

```text
Approve discrepancy
       ↓
Validate faculty authority
       ↓
Invoke attendance correction workflow
       ↓
Transaction
       ↓
Audit
       ↓
Resolve discrepancy
```

This keeps attendance integrity centralized.

---

# 71. Materials Architecture

Separate:

```text
Material metadata
```

from:

```text
Stored binary object
```

Example:

```text
PostgreSQL
Material
├── id
├── course_offering_id
├── title
├── category
├── current_version_id
├── publisher
└── visibility

Supabase Storage
Object
└── opaque storage key
```

Never use a user-provided filename as the storage identity.

---

# 72. Material Versioning

Material versions should be immutable.

Preferred:

```text
Material
   ↓
Version 1
Version 2
Version 3
```

A replacement should create a new version rather than mutating an old binary object in place.

The published version is a controlled pointer.

This makes history and rollback possible.

---

# 73. Announcement Architecture

Announcements should distinguish:

```text
DRAFT
SCHEDULED
PUBLISHED
EXPIRED
ARCHIVED
```

Audience must be represented explicitly.

Examples:

```text
Course Offering
Section
Institution
Specific authorized audience
```

Never broadcast an announcement to all students simply because the creator is faculty.

---

# 74. Timetable Architecture

Timetable data should be stored as institution-controlled schedule records.

The student and faculty UI should read the same authoritative schedule source, filtered by authorization.

A timetable update must not require rewriting historical attendance records.

Attendance sessions should preserve their actual recorded date/time.

---

# 75. Academic Performance Architecture

Grades and performance should be modeled as official academic records.

Student-facing calculations:

```text
Course grades
      ↓
Credits
      ↓
Semester result
      ↓
SGPA
      ↓
Historical semesters
      ↓
CGPA
```

The exact academic formula must be institution-configurable where institutions differ.

Never hardcode a universal grading policy into the UI.

---

# 76. Feedback Architecture

Feedback should distinguish:

```text
Feedback Form
    ↓
Questions
    ↓
Eligibility
    ↓
Submission
    ↓
Response storage
    ↓
Aggregation / reporting
```

Eligibility must be server-derived.

Students must not be able to submit feedback merely by discovering a form ID.

---

# 77. Anonymous Feedback Architecture

Anonymous feedback requires a stronger privacy boundary.

Do not rely on:

```text
student_id + is_anonymous = true
```

and merely hide the ID from faculty.

Where true anonymity is required:

```text
Eligibility
     ↓
Controlled submission authorization
     ↓
Anonymous response
     ↓
Privacy-preserving aggregation
     ↓
Faculty aggregate result
```

The faculty result path must not expose the identity mapping.

If institutional policy requires auditability of submission eligibility, that information must remain separated from the response identity exposed to faculty.

---

# 78. Notification Architecture

Notifications should be stored as durable records.

Conceptually:

```text
Notification
├── recipient
├── type
├── title
├── body
├── resource reference
├── created_at
├── read_at
└── delivery metadata
```

Realtime is the acceleration mechanism.

The database record remains the durable notification source.

If realtime fails, the notification must still appear when the user opens the notification center.

---

# 79. Notification Delivery Channels

Initial implementation:

```text
In-app notifications
        +
Realtime delivery
```

Future optional channels:

```text
Browser push
Email
SMS
```

These must be separate delivery adapters.

Do not tightly couple core academic workflows to an external notification provider.

A notification provider failure must not roll back a successful attendance transaction.

---

# 80. Search Architecture

Initial search should use PostgreSQL.

Use:

- indexed columns
- normalized search fields
- controlled filtering
- pagination
- bounded result sizes

Examples:

```text
Student name
Roll number
Course code
Course name
Material title
Announcement title
```

Elasticsearch is not required initially.

Introduce a search engine only if PostgreSQL search is demonstrated to be insufficient.

---

# 81. Pagination Contract

Collection APIs must define pagination semantics.

Preferred baseline:

```text
page
page_size
```

or cursor-based pagination for high-volume resources.

Server must enforce maximum page size.

Example:

```text
requested page_size = 100000
```

must not cause an unrestricted database query.

---

# 82. Filtering and Sorting

Filtering must be explicit and validated.

Do not allow arbitrary SQL expressions from clients.

For example:

```text
sort=attendance_percentage
```

may map to an approved server-side field.

But:

```text
sort=<raw SQL>
```

must never be accepted.

---

# 83. Rate Limiting Architecture

Rate limiting is required.

At minimum protect:

```text
Authentication
OTP
Password reset
Discrepancy submission
Feedback submission
File upload
Search
Expensive reports
Administrative operations
```

Initial strategy:

```text
Application-level rate limiting
+
provider-level edge protections
```

Do not add Redis solely for rate limiting.

A distributed rate-limit store may be introduced later if scale requires it.

---

# 84. File Security Pipeline

File handling should follow:

```text
Upload
  ↓
Authentication
  ↓
Authorization
  ↓
Size validation
  ↓
Extension validation
  ↓
MIME/content validation
  ↓
Safe object key generation
  ↓
Quarantine/private storage
  ↓
Malware scanning where required
  ↓
Approved
  ↓
Publish
```

If scanning is asynchronous:

```text
PENDING_SCAN
    ↓
CLEAN → AVAILABLE
    ↓
MALICIOUS → REJECTED/QUARANTINED
```

Students must not receive a file before it passes the required security checks.

---

# 85. Upload Limits

The application must define configurable limits for:

- maximum file size
- permitted MIME types
- permitted extensions
- upload frequency
- total course storage quota
- filename length
- metadata length

Limits must be enforced server-side.

---

# 86. Session and Device Management

Because student and faculty requirements include active device/session lists, the application must expose a controlled session-management model.

Required capabilities:

- current session identification
- active session listing
- current-device logout
- logout-all-devices
- session expiration
- revocation
- security-event invalidation

Do not expose raw authentication tokens to users or the frontend.

Device metadata should be minimized and should not become a tracking system.

---

# 87. CSRF and Browser Security

The authentication transport must be chosen deliberately.

If cookie-based authentication is used:

- Secure
- HttpOnly
- SameSite
- CSRF protection where required

If bearer tokens are used:

- avoid unsafe long-term persistence in browser storage
- minimize token exposure
- handle expiry and refresh securely

Do not store sensitive long-lived credentials in `localStorage` merely because it is convenient.

---

# 88. Content Security Policy

Production should use a Content Security Policy appropriate to the deployed application.

The policy should be restrictive enough to reduce XSS risk without blindly using unsafe directives.

Avoid:

```text
script-src 'unsafe-inline' *
```

as a convenience configuration.

CSP should be tested against:

- Vite production output
- authentication flows
- realtime
- file previews
- third-party assets actually required

---

# 89. CORS

CORS must explicitly allow only approved frontend origins.

Development:

```text
localhost development origin(s)
```

Staging:

```text
staging origin
```

Production:

```text
official Praesentia origin
```

Never default authenticated production APIs to:

```text
Access-Control-Allow-Origin: *
```

---

# 90. Database Schema Rules

Critical invariants must be represented in PostgreSQL whenever practical.

Examples:

```text
UNIQUE(student_id, course_offering_id)

UNIQUE(faculty_id, course_offering_id, section_id)

UNIQUE(attendance_session_id, student_id)

FOREIGN KEY(...)
CHECK(status IN (...))
```

The exact constraints depend on the final schema.

Application validation and database constraints must reinforce each other.

---

# 91. Indexing Strategy

Every high-volume query must have an indexing plan.

Likely indexed dimensions include:

```text
institution_id
student_id
faculty_id
course_id
course_offering_id
section_id
academic_period_id
attendance_session_id
date
status
created_at
```

Do not blindly index every column.

Indexes must correspond to actual access patterns.

---

# 92. Transaction Boundaries

Transactions must correspond to business operations.

Examples:

### Attendance submission

```text
validate
→ update session
→ insert/update attendance records
→ create audit event
→ commit
```

### Attendance correction

```text
validate
→ update official state
→ create correction/audit record
→ commit
```

### Material publishing

```text
validate version
→ update publication pointer
→ audit
→ commit
```

Do not perform half of a critical operation in one transaction and half outside it without a deliberate consistency strategy.

---

# 93. Audit Architecture

Audit logging should be treated as its own domain.

Audit events should capture:

```text
actor
institution
action
resource_type
resource_id
timestamp
result
request_id
reason
previous_state where required
new_state where required
```

Audit records must not be editable by ordinary users.

For high-value academic changes, the audit event should be committed atomically with the academic mutation.

---

# 94. Observability Architecture

Initial observability:

```text
Cloud Run logs
+
structured FastAPI logs
+
request IDs
+
health endpoints
+
database/provider metrics
```

Recommended health separation:

```text
/live
```

indicates process health.

```text
/ready
```

indicates whether the service can safely serve requests.

Health endpoints must not expose secrets or internal database credentials.

---

# 95. Background Work Architecture

The initial system deliberately avoids a permanent queue.

Where scheduled/background work is required, examples include:

- scheduled announcements
- report generation
- cleanup
- backup orchestration
- notification delivery

The implementation should prefer the simplest reliable mechanism available in the deployment environment.

If work becomes:

- long-running
- high-volume
- retry-heavy
- independently scalable
- operationally critical

then a durable queue may be introduced.

That decision requires measurement.

---

# 96. Report Generation

The report layer should be isolated from API routing.

Recommended:

```text
Report request
    ↓
Authorization
    ↓
Report query
    ↓
Report service
    ↓
Format renderer
    ├── PDF → ReportLab
    ├── CSV → Python csv / pandas where useful
    └── XLSX → openpyxl
```

Reports must obey the same authorization boundaries as normal API data.

A faculty report must never accidentally include another faculty member's course.

---

# 97. Export Safety

Exports are sensitive data operations.

Requirements:

- authorization before generation
- bounded date/range filters
- bounded row counts
- audit high-risk exports
- secure temporary storage
- controlled download
- expiration/cleanup
- no public permanent export URLs

---

# 98. Performance Budget

Performance must be measured.

Initial targets should include:

- fast first meaningful application render on a reasonable mobile connection
- bounded API response sizes
- paginated large datasets
- no unnecessary dashboard fan-out
- lazy loading of heavy screens
- optimized charts
- compressed assets
- efficient database queries

Exact numeric budgets should be established after representative data and device testing rather than invented without measurement.

---

# 99. Database Connection Management

Because Cloud Run can scale horizontally, database connections must be controlled.

Requirements:

- bounded SQLAlchemy connection pools
- appropriate connection recycling
- sensible request concurrency
- database connection monitoring
- connection pooling where the deployment architecture benefits from it

Do not allow each container instance to create an uncontrolled number of database connections.

---

# 100. Realtime Failure Strategy

Realtime is secondary infrastructure.

If realtime fails:

```text
Database remains authoritative
API remains usable
Notification records remain durable
UI can refetch
```

Never make official academic persistence depend exclusively on successful realtime delivery.

---

# 101. External Dependency Failure Strategy

For any third-party dependency:

```text
Primary academic operation
        │
        ├── must remain correct
        │
        └── secondary dependency
              ↓
          may fail safely
```

Examples:

- notification provider failure must not invalidate attendance
- analytics failure must not invalidate a grade
- realtime failure must not invalidate a correction
- report-generation failure must not modify academic records

---

# 102. Data Retention

Retention must be configurable according to institutional policy.

Do not automatically delete:

- attendance history
- grades
- correction history
- audit records

simply because they are old.

Retention and deletion policies must be explicit.

---

# 103. Privacy by Design

Minimize data collection.

Do not collect:

- unnecessary device fingerprints
- unnecessary location data
- unnecessary behavioral tracking
- unnecessary analytics identifiers

Only collect what is required for:

- authentication
- academic operation
- security
- audit
- reliability
- institutional requirements

---

# 104. Analytics Policy

Product analytics must never become a side channel for academic data.

Do not send to generic analytics systems:

- attendance records
- grades
- private feedback
- student names
- roll numbers
- authentication tokens
- private academic identifiers

Operational metrics should be aggregated and privacy-conscious.

---

# 105. Frontend Security Boundary

The frontend may:

- display
- collect
- validate for UX
- navigate
- cache non-sensitive data
- request authorized operations

The frontend may not:

- authorize itself
- calculate official academic truth
- mutate PostgreSQL directly
- expose service-role credentials
- bypass API workflows
- treat hidden controls as security

---

# 106. Reusable Frontend Architecture

Frontend organization should be feature-oriented.

Example:

```text
frontend/src/
├── app/
├── components/
│   ├── ui/
│   └── domain/
├── features/
│   ├── auth/
│   ├── student/
│   ├── faculty/
│   ├── attendance/
│   ├── courses/
│   ├── materials/
│   ├── timetable/
│   ├── feedback/
│   └── notifications/
├── lib/
├── hooks/
├── routes/
├── types/
└── tests/
```

Standard UI belongs under the shadcn-based UI layer.

Domain components may compose those primitives.

---

# 107. API Client Architecture

Do not scatter raw `fetch()` calls throughout React components.

Preferred:

```text
React feature
    ↓
TanStack Query hook
    ↓
typed API client
    ↓
HTTP
    ↓
FastAPI
```

The API client should centralize:

- base URL
- authentication handling
- headers
- error normalization
- request IDs where applicable
- response parsing

---

# 108. Frontend Data Freshness

Different data should have different freshness policies.

Examples:

```text
Attendance dashboard → short freshness / realtime where useful
Course metadata      → longer freshness
Academic history     → stable
Notifications        → realtime + durable cache
Timetable             → refetch on relevant update
```

Do not set one global stale time for the entire application.

---

# 109. Offline Behavior

Praesentia is not an offline-first academic system.

For official academic mutations:

> **The server must confirm success.**

Read-only data may be cached for UX.

Attendance submission must not silently succeed offline and later invent an academic record.

If offline support is later added, it requires an explicit synchronization and conflict-resolution architecture.

---

# 110. Mobile Network Resilience

The frontend should handle:

- slow connections
- temporary disconnects
- request timeouts
- retryable failures
- duplicate taps
- app/tab suspension

For critical mutations:

```text
disable duplicate submission
+
idempotent backend
+
clear pending/success/failure state
```

---

# 111. Testing Pyramid

Testing should follow:

```text
                 E2E
                /   \
        Integration / Authorization
              /         \
         Domain / Service Tests
             /           \
       Unit / Component Tests
```

Security-sensitive authorization tests should exist at the backend/service layer, not only in browser tests.

---

# 112. Contract Testing

The frontend and backend must be protected from API drift.

At minimum:

- OpenAPI remains generated
- schemas remain explicit
- breaking changes are reviewed
- integration tests verify important endpoints
- generated/client types may be introduced if useful

The frontend must not silently assume fields that the backend no longer provides.

---

# 113. Migration Strategy

Database changes should follow a safe pattern:

```text
Expand
  ↓
Deploy compatible application
  ↓
Migrate/backfill
  ↓
Switch usage
  ↓
Contract/remove old structure later
```

Avoid destructive one-step migrations when existing production data depends on the old structure.

---

# 114. CI/CD

CI should run at minimum:

```text
Frontend:
- install
- typecheck
- lint
- unit/component tests
- production build

Backend:
- install
- lint/format checks
- type checks where configured
- unit tests
- integration tests
- migration validation

Security:
- dependency audit
- secret scanning
```

Production deployment should occur only after required checks pass.

---

# 115. Formatting and Static Analysis

Recommended baseline:

### Frontend

```text
ESLint
Prettier
TypeScript compiler
```

### Backend

```text
Ruff
Black or Ruff formatter
Pyright or mypy where adopted
Pytest
```

Use one formatter consistently.

Do not maintain competing formatting systems.

---

# 116. Dependency Locking

Dependencies must be reproducible.

Frontend:

```text
package-lock.json
```

must be committed.

Python dependencies must be pinned or locked through the chosen Python packaging workflow.

Production builds should not silently install arbitrary newer dependency versions.

---

# 117. Container Security

The backend container should:

- use a minimal supported base image
- run as a non-root user
- avoid unnecessary OS packages
- pin important dependencies
- expose only the required port
- include health checks where appropriate
- never contain secrets
- be rebuilt regularly for security updates

---

# 118. Deployment Separation

Deployment environments:

```text
LOCAL
   ↓
CI
   ↓
STAGING
   ↓
PRODUCTION
```

Each environment gets independent:

- secrets
- database
- Supabase project/environment where practical
- storage
- frontend origin
- backend origin

Never test destructive migrations against production.

---

# 119. Backup and Restore Architecture

Production backup strategy should include both:

```text
Managed database backups
+
Independent backup copies
```

Independent backup:

```text
PostgreSQL
   ↓
Encrypted backup artifact
   ↓
Backblaze B2
   ↓
Retention
   ↓
Restore test
```

Restore tests should verify:

- schema
- academic records
- audit records
- relationships
- application compatibility

A backup job succeeding is not enough.

---

# 120. Disaster Recovery

The deployment must define:

```text
RPO — acceptable data loss window
RTO — acceptable recovery time
```

These values should be agreed with the institution before production.

Do not invent an RPO/RTO and call it institutional policy.

---

# 121. Security Review Gates

Before production:

### Gate 1
Authentication reviewed.

### Gate 2
Authorization reviewed.

### Gate 3
RLS reviewed.

### Gate 4
Attendance integrity reviewed.

### Gate 5
File upload reviewed.

### Gate 6
Session/security headers reviewed.

### Gate 7
Dependency vulnerabilities reviewed.

### Gate 8
Backup restore tested.

### Gate 9
E2E critical workflows tested.

### Gate 10
Production configuration reviewed.

---

# 122. Threat Model Baseline

The system must assume:

```text
Attacker can:
- modify browser code
- call APIs directly
- modify request bodies
- modify IDs
- replay requests
- automate requests
- inspect public frontend code
- attempt cross-user access
- upload malicious files
- exploit race conditions
```

The system must not assume:

```text
"Users will only click the UI."
```

---

# 123. Threats Specifically Relevant to Praesentia

At minimum consider:

- account takeover
- credential stuffing
- OTP abuse
- IDOR/BOLA
- privilege escalation
- cross-institution access
- cross-section access
- attendance manipulation
- correction abuse
- duplicate submissions
- race conditions
- malicious uploads
- XSS
- CSRF
- SQL injection
- data leakage through exports
- anonymous-feedback deanonymization
- notification leakage
- realtime authorization bypass
- insecure direct storage access
- secret leakage
- dependency compromise

---

# 124. Security Principle for AI Coding Agents

AI agents must not infer architecture from a single feature request.

Before changing security-sensitive code, the agent should inspect:

```text
PROJECT_RULES.md
TECHSTACK.md
AGENTS.md
relevant feature specification
existing implementation
tests
database constraints
```

The agent must preserve existing security invariants.

---

# 125. Feature-to-Stack Coverage Matrix

| Product area | Primary technologies |
|---|---|
| Authentication | Supabase Auth + FastAPI |
| Sessions | Supabase Auth + application session model |
| Student profile | React + FastAPI + PostgreSQL |
| Faculty profile | React + FastAPI + PostgreSQL |
| Dashboard | React + TanStack Query |
| Attendance | FastAPI + SQLAlchemy + PostgreSQL |
| Corrections | FastAPI transaction + PostgreSQL + audit |
| Discrepancies | FastAPI + PostgreSQL |
| Courses | PostgreSQL |
| Enrollment | PostgreSQL |
| Materials | Supabase Storage + PostgreSQL |
| Material versions | PostgreSQL + Storage |
| Timetable | PostgreSQL + React |
| Academic calendar | PostgreSQL + React |
| SGPA/CGPA | Backend academic rules + PostgreSQL |
| Feedback | FastAPI + PostgreSQL |
| Anonymous feedback | Privacy-separated submission/aggregation model |
| Notifications | PostgreSQL + Realtime |
| Faculty communication | PostgreSQL + Realtime |
| Search | PostgreSQL indexes/querying |
| Reports | FastAPI + ReportLab/openpyxl/CSV |
| Audit | PostgreSQL |
| Realtime | Supabase Realtime |
| Security | FastAPI + RLS + PostgreSQL |
| Testing | Pytest + Vitest + RTL + Playwright |
| Frontend hosting | Cloudflare Pages |
| Backend hosting | Cloud Run |
| Backup | Managed backups + Backblaze B2 |

---

# 126. What Is Deliberately Not in the Stack

The absence of a technology is intentional.

No initial:

```text
Redis
Kafka
RabbitMQ
Celery
Elasticsearch
Kubernetes
microservices
MongoDB
Firebase
Next.js
native mobile app
separate analytics database
separate search database
```

The project should earn the complexity of each additional system through an actual requirement or measured bottleneck.

---

# 127. When a New Technology May Be Added

A new infrastructure technology requires a written justification covering:

```text
Problem
↓
Why current stack cannot solve it
↓
Expected benefit
↓
Security implications
↓
Operational complexity
↓
Cost
↓
Failure mode
↓
Recovery strategy
↓
Testing impact
↓
Long-term maintenance
```

"Industry standard" or "everyone uses it" is not sufficient justification.

---

# 128. Final Architecture Contract

Praesentia's technology architecture is:

```text
                         PRAESENTIA
                              │
                     Mobile-first Web App
                              │
                    React + TypeScript
                              │
          ┌───────────────────┼──────────────────┐
          │                   │                  │
       Tailwind            shadcn/ui       Phosphor
          │
       Vite
          │
    TanStack Query
          │
    React Hook Form
          │
         Zod
                              │
                              ▼
                           HTTPS
                              │
                              ▼
                           FastAPI
                              │
                 ┌────────────┼────────────┐
                 │            │            │
           Auth Context   Authorization   Validation
                 │            │            │
                 └────────────┼────────────┘
                              │
                     Application Services
                              │
                         Domain Rules
                              │
                     Repository / SQLAlchemy
                              │
                         Transaction
                              │
                              ▼
                         PostgreSQL
                              │
              ┌───────────────┼────────────────┐
              │               │                │
             RLS          Supabase Storage   Realtime
              │
              ▼
        Durable Academic Truth

Deployment:
├── Cloudflare Pages
├── Google Cloud Run
└── Managed + Independent Backups

Testing:
├── Vitest
├── React Testing Library
├── Pytest
├── HTTPX
└── Playwright
```

---

# 129. Final Decision

The stack is now considered complete at the **architecture level**.

The implementation may still require individual libraries for specific concerns, but those libraries must follow the dependency policy and must not alter the architectural direction.

The approved principle remains:

> **Use the simplest architecture that can securely preserve academic truth at the required scale.**

Praesentia is not optimized to have the largest technology stack.

It is optimized to have a **small, coherent, secure, testable, recoverable, and maintainable technology stack that can implement the entire approved student and faculty product scope.**
