# Praesentia — College Academic & Attendance Management System

> **Official Continuous Internal Evaluation (CIE) & Academic Governance Portal**  
> Tailored for the Department of Information Technology, Chaitanya Bharathi Institute of Technology (CBIT Autonomous).  
> **Architecture:** Pure Modular Vanilla Web Stack (HTML5, CSS3, ES Modules JavaScript) with Supabase Database Sync and Offline-First Local Storage Engine. Zero React / TypeScript runtime overhead.

---

## 1. What is Praesentia?

**Praesentia** is a specialized college academic-management experience engineered to bridge the gap between autonomous college academic evaluation standards and real-time student visibility. It provides:

1. **Student CIE Dashboard:** A transparent, read-only interface allowing students to view their verified Continuous Internal Evaluation (CIE) components, slip tests, class tests, attendance standing, and weekly laboratory performance without delays or manual grade sheet inquiries.
2. **Faculty CIE Workspace:** An interactive evaluation matrix for authorized course coordinators to record, modify, and audit student marks for:
   - **Template A (Theory CIE — Max 40 Marks):** Dynamic slip test best-of-two calculations, class test averaging, and attendance scaling.
   - **Template C (Dynamic Lab Weekly CIE — Max 30 Marks per week):** Flexible week-by-week evaluation (PEP, EXP, PEA, Record, Conduct) with aggregate semester performance calculation.
3. **Institutional Risk Intelligence:** Live class average metrics, grade distribution, and proactive identification of students at risk of attendance condonation or detention.
4. **Data Portability & Audit:** Instant CSV and JSON roster exports, official printable mark sheets, and discrepancy submission workflows.

---

## 2. Why Praesentia?

Autonomous engineering institutions like CBIT adhere to rigorous Continuous Internal Evaluation (CIE) rubrics where a student's final grade is heavily weighted by incremental assessments conducted across 16 semester weeks.

### Core Problems Solved:

- **Calculation Fallibility & Delays:** Historically, faculty manually compute averages, best-of-two slip tests, and attendance weightings across spreadsheets. Rounding inconsistencies and transcription errors lead to post-deadline discrepancies.
- **Student Information Asymmetry:** Students often enter semester-end exams without knowing their confirmed internal marks or attendance percentage, risking unexpected detention or lost letter grades.
- **Rigid Lab Schedules:** Standard ERP systems require a fixed 12-week schedule. In reality, academic calendars fluctuate due to holidays, revision labs, or internal exams. Praesentia's **Template C** supports dynamic, independent week creation on a per-subject basis.
- **Bloat & Fragility:** Heavy single-page-application frameworks introduce build configuration drift, runtime dependencies, and vulnerability churn. Praesentia uses a **standards-first Vanilla ES Module architecture**, guaranteeing instant load times, zero compilation steps, and permanent long-term stability.

---

## 3. How It Works: Technical Architecture

### 3.1 Architecture Overview

```text
                                  PRAESENTIA CLIENT
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
           PRESENTATION LAYER                              DOMAIN & STATE
                 │                                               │
       HTML5 Semantic Views (index.html)              ES Modules Architecture (/js)
       Institutional Theme (/css/style.css)           ├── Domain: Template A & C Engines
       Phosphor / SVG Vector System                  ├── State: Reactive StateStore
       Print Media Stylesheets                        ├── Services: Supabase & CSV Exporters
                 │                                    └── UI: View Renderers & Toasts
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         │
                                  PERSISTENCE LAYER
                                         │
                        ┌────────────────┴────────────────┐
                        │                                 │
                 SUPABASE POSTGRES               OFFLINE LOCALSTORAGE
                 (Cloud Sync Layer)              (Instant Fallback Engine)
                 ├── praesentia_roster           ├── Local Roster
                 ├── praesentia_lab_weeks        ├── Dynamic Lab Weeks
                 └── praesentia_discrepancies    └── Discrepancy Registry
```

### 3.2 Directory Structure

```text
├── index.html                  # Unified semantic application entry
├── package.json                # Minimal package metadata and test scripts
├── test.js                     # TDD automated verification suite (Node.js assert)
├── .gitignore                  # Production Git ignore rules
├── PRD.md                      # Product Requirements Document
├── TECHSTACK.md                # Institutional Technology Architecture Spec
├── template-a-theory-cie.pdf   # Official CBIT IT Department Theory Template
├── template-c-dynamic-lab-cie.pdf # Official CBIT IT Department Lab Template
│
├── css/
│   └── style.css               # Luxury institutional dark design system
│
└── js/
    ├── main.js                 # Application bootstrapper and navigation controller
    │
    ├── domain/                 # Isolated domain business logic (100% pure functions)
    │   ├── templateA.js        # Theory CIE calculation & validation engine
    │   ├── templateC.js        # Dynamic Lab Weekly CIE calculation engine
    │   └── analytics.js        # Class averages, pass rates, risk calculation
    │
    ├── data/
    │   └── initialData.js      # Authoritative synthetic demo data (CBIT IT-1 roster)
    │
    ├── state/
    │   └── store.js            # Reactive application store with LocalStorage bridge
    │
    ├── services/
    │   ├── supabase.js         # Cloud PostgreSQL integration with offline fallback
    │   └── exporter.js         # CSV, JSON, and print formatting services
    │
    └── ui/
        ├── studentView.js      # Student dashboard rendering and scorecards
        ├── facultyView.js      # Spreadsheet matrix, toolbar, and search logic
        ├── modal.js            # Discrepancy reports & student enrollment modals
        └── toast.js            # Non-blocking status notification system
```

---

## 4. Mathematical Specifications & Domain Rules

### 4.1 Template A: Theory CIE (Max 40 Marks)

Calculated in accordance with CBIT Regulation:
$$\text{Total CIE} = \text{ACT} + \text{AAss} + \text{AST} + \text{ATT}$$

1. **Class Test Average (ACT — Max 20 Marks):**
   - Students take Class Test 1 ($\text{CT}_1 \le 20$) and Class Test 2 ($\text{CT}_2 \le 20$).
   - $\text{ACT} = \text{round}\left(\frac{\text{CT}_1 + \text{CT}_2}{2}\right)$.
   - An absent test ($\text{AB}$) is treated as 0 in the divisor of 2.
2. **Assignment Average (AAss — Max 10 Marks):**
   - Students submit Assignment 1 ($\text{Ass}_1 \le 10$) and Assignment 2 ($\text{Ass}_2 \le 10$).
   - $\text{AAss} = \frac{\text{Ass}_1 + \text{Ass}_2}{2}$, formatted to 1 decimal place.
3. **Best-of-Two Slip Tests Average (AST — Max 5 Marks):**
   - Three slip tests are conducted: $\text{ST}_1, \text{ST}_2, \text{ST}_3 \le 5$.
   - The top two marks are selected:
     $$\text{AST} = \text{round}\left(\frac{\max_1 + \max_2}{2}\right)$$
4. **Attendance Marks (ATT — Max 5 Marks):**
   - Scaled from biometric attendance percentage (0 to 5 marks).
5. **Pending Rule:** If any component has not yet been conducted, the total is explicitly flagged as **Pending** rather than fabricating an artificial zero.

### 4.2 Template C: Dynamic Lab Weekly CIE (Max 30 Marks per week)

1. **Weekly Components:**
   - **PEP** (Pre-Experiment Preparation): Max 5 M
   - **EXP** (Experimentation & Problem Solving): Max 10 M
   - **PEA** (Post-Experiment Analysis / Viva): Max 5 M
   - **Rec** (Record Submission): Max 5 M
   - **Cond** (Laboratory Conduct): Max 5 M
   - **Total Weekly Mark:** $\text{PEP} + \text{EXP} + \text{PEA} + \text{Rec} + \text{Cond} = 30\text{ M}$.
2. **Dynamic Schedule:** Faculty can add, modify, and manage weeks independently for each subject.
3. **Aggregate CIE:** The semester lab CIE represents the average across all completed weekly sessions.

---

## 5. Getting Started

### Prerequisites

- Any modern web browser (Chrome, Edge, Firefox, Safari).
- [Node.js](https://nodejs.org/) (v18 or higher) for running automated tests or serving locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/praesentia.git
cd praesentia
```

### 2. Run Automated Verification Tests

Praesentia adheres to Test-Driven Development (TDD). Validate all calculation logic using the Node.js test runner:

```bash
npm test
# Or directly:
node test.js
```

Expected output:
```text
--- RUNNING PRAESENTIA TDD MODULE TESTS ---
✓ ALL PRAESENTIA TDD MODULE TESTS PASSED!
```

### 3. Launch Development Server

Serve the application locally using Python or Node.js:

```bash
# Using Python:
python -m http.server 3000

# Or using npx:
npx serve -l 3000 .
```

Open your browser to: **[http://localhost:3000](http://localhost:3000)**

---

## 6. Usage Walkthrough

### 6.1 Student Flow
1. On the landing page, choose **Student Portal**.
2. Enter the demo Roll Number: `160125737071` (Aarav Sharma).
3. Inspect the verified **Theory CIE** breakdown (ACT, AAss, AST, ATT) and **Lab Weekly Progression**.
4. If a discrepancy exists, click **Report Mark Discrepancy** to submit a formal note.

### 6.2 Faculty Flow
1. On the landing page, choose **Faculty Portal**.
2. Enter the demo Faculty ID: `FAC-IT-101` (Dr. Sagar Gujjunoori).
3. In the workspace, edit any cell in the spreadsheet (e.g., change `CT1` to `18.0`).
4. Watch **ACT** and **Total (40)** update in real time.
5. Search students dynamically using the search bar.
6. Click **Add Lab Week** in Template C to introduce a new lab session.
7. Click **Save Theory Marks** or **Export CSV** to back up records.

---

## 7. Supabase Database Configuration (Optional)

To connect Praesentia to a live Supabase PostgreSQL backend:

1. Create a project at [supabase.com](https://supabase.com).
2. Create the required tables via SQL Editor:

```sql
create table praesentia_roster (
  rollNo text primary key,
  name text not null,
  sNo int,
  ct1 float,
  ct2 float,
  ass1 float,
  ass2 float,
  st1 float,
  st2 float,
  st3 float,
  att float,
  updated_at timestamp default now()
);

create table praesentia_lab_weeks (
  weekNumber int primary key,
  date text,
  entries jsonb
);

create table praesentia_discrepancies (
  id text primary key,
  studentRoll text,
  subject text,
  component text,
  note text,
  timestamp timestamp default now()
);
```

3. Expose your credentials in the client window:
```html
<script>
  window.SUPABASE_CONFIG = {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key'
  };
</script>
```

When no credentials are supplied, Praesentia automatically activates its **zero-config offline persistence engine** (`localStorage`), ensuring flawless local demos.

---

## 8. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm test` | Runs the Node.js TDD unit test suite verifying CIE formulas |
| `npm start` | Launches a local HTTP static server on port 3000 |
| `node test.js` | Direct execution of domain assertion suite |

---

## 9. License

Developed for academic demonstration and research purposes under CBIT autonomous curriculum guidelines. Licensed under the MIT License.
