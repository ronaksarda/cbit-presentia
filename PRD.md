# Praesentia — Prototype Product Requirements Document

**Status:** Draft for prototype implementation  
**Product:** Praesentia — College Academic & Attendance Management System  
**Institutional context:** Chaitanya Bharathi Institute of Technology (CBIT)  
**Document owner:** Product / project team  
**Last updated:** 2026-10-09

> This PRD defines the prototype scope. It does not override `PROJECT_RULES.md`, `TECHSTACK.md`, `STUDENT_FEATURES.md`, `FACULTY_FEATURES.md`, or the final approved `DESIGN.md`. Any institutional rule not supported by an authoritative source must be marked **Pending institutional confirmation**.

## 1. Product summary

Praesentia is a college academic-management experience intended to help students understand their academic standing and help authorized faculty manage relevant academic records. The prototype should demonstrate a coherent, credible student and faculty experience without implying that unimplemented integrations or institutional approvals already exist.

The prototype is not permission to invent academic policies, grades, attendance rules, student data, faculty assignments, or institutional claims.

## 2. Prototype objectives

1. Provide a concise, polished entry experience for Praesentia.
2. Present distinct Student and Faculty login experiences.
3. Demonstrate the student CIE dashboard using clearly identified demo/synthetic data.
4. Demonstrate a faculty CIE mark-entry workflow for authorized demo courses.
5. Support **Template A — Theory CIE**.
6. Support **Template C — Dynamic Lab Weekly CIE**, allowing a faculty user to manage weeks independently for each relevant subject.
7. Make data provenance, incomplete data, and unconfirmed rules visible rather than guessing.
8. Preserve accessibility, responsive behavior, validation, and role separation.

## 3. Non-goals and exclusions

- Template B (fixed lab-internal format) is excluded from this prototype.
- Do not implement or imply integrations with ERP, biometric systems, LMS, email, SMS, or other systems unless separately specified and demonstrably implemented.
- Do not claim official CBIT approval, official partnership, production readiness, institutional deployment, or real-time synchronization without evidence.
- Do not invent analytics, attendance values, CIE formulas, course assignments, user counts, performance statistics, or outcomes.
- Do not build unrelated modules merely because they appear in existing broader feature documents.
- Do not rewrite the backend, authentication, database, routing, or shared application shell as part of a landing-page-only task.
- The landing page is not a checklist of all platform features; it should be concise and experience-led.
- No student-side editing of official marks or attendance.

## 4. Users and roles

### 4.1 Student
A student can sign in through the Student experience and view only the academic records associated with their own identity. The prototype student dashboard focuses on CIE information.

### 4.2 Faculty
A faculty member can sign in through the Faculty experience and view/manage CIE entries only for subjects, sections, and students they are explicitly authorized to access.

### 4.3 Administrator
The wider architecture may support an administrator role, but an admin portal or admin workflow is not part of this prototype unless explicitly added to scope. Do not expose admin-only controls in the prototype by assumption.

### 4.4 Demo user
A demo user is a clearly labelled synthetic account used to demonstrate a workflow. Demo identities and records must not be mistaken for real students, staff, or official academic records.

## 5. Primary user journeys

### 5.1 Landing page → Student
1. User opens the landing page.
2. User understands the product’s purpose from concise, accurate copy.
3. User chooses the Student path.
4. User reaches the Student login experience.
5. After successful demo authentication, user reaches the Student CIE dashboard.
6. User can inspect the available CIE information and distinguish confirmed values from incomplete or illustrative data.

### 5.2 Landing page → Faculty
1. User opens the landing page.
2. User chooses the Faculty path.
3. User reaches the Faculty login experience.
4. After successful demo authentication, user reaches the Faculty CIE workspace.
5. User selects an assigned demo subject/section.
6. User opens Template A or Template C as applicable.
7. User enters or edits marks within validation constraints.
8. User reviews the changes and saves/submits according to the workflow defined for the prototype.
9. The interface clearly communicates success or failure and does not silently discard changes.

### 5.3 Faculty → Template A — Theory CIE
1. Faculty opens an authorized theory subject.
2. Faculty sees the configured Template A fields.
3. Faculty enters or edits marks for a student or roster.
4. The system validates required fields and permitted ranges.
5. Derived totals are calculated only according to an approved formula.
6. If a formula is not yet confirmed, the UI must not fabricate an official total; it should label the result as pending/unavailable or use an explicitly non-authoritative preview.
7. Faculty reviews and saves.

### 5.4 Faculty → Template C — Dynamic Lab Weekly CIE
1. Faculty opens an authorized lab subject.
2. Faculty sees weeks configured for that subject only.
3. Faculty can add, edit, and manage week entries independently for that subject.
4. Week dates and fields are validated.
5. Weekly total out of 30 is shown only when its calculation is confirmed.
6. Aggregate/average CIE is shown only according to an approved rule and the defined treatment of incomplete/absent weeks.
7. The user can identify incomplete weeks and unsaved changes.

## 6. Functional requirements

### FR-01 — Landing page
- Present Praesentia’s purpose accurately and concisely.
- Provide clear Student and Faculty paths.
- Use the approved `DESIGN.md` once supplied.
- Use the provided CBIT emblem/logo only in a restrained, respectful manner; preserve proportions and source colors.
- Do not invent metrics, testimonials, deployment claims, integrations, or institutional endorsements.
- Keep this page a presentation/entry surface. It must not require backend changes unless separately authorized.

### FR-02 — Role-specific login entry
- Student and Faculty entry points must be distinguishable.
- Forms must have labels, validation, loading states, error states, and keyboard accessibility.
- The client must not be the authority for the user’s role.
- Authentication implementation must follow the approved stack and `PROJECT_RULES.md`.
- Demo credentials, if used, must be documented in `SECURITY_AND_DEMO.md`; never hard-code real credentials or expose secrets.

### FR-03 — Student CIE dashboard
- Show only the signed-in student’s permitted CIE records.
- Identify subject/course, assessment type, available component marks, total/status where approved, and relevant academic period when supported by the data.
- Show loading, empty, incomplete, error, and stale-data states where relevant.
- Do not display made-up marks as if official.
- Students must not edit official CIE marks or attendance.
- Do not infer a missing mark as zero unless the approved rule explicitly says so.

### FR-04 — Faculty CIE workspace
- Display only authorized assigned subjects/sections.
- Make the selected subject, section, academic period, and template explicit.
- Support roster search/filter only where the source data supports it.
- Avoid unrelated attendance, announcements, materials, or analytics unless explicitly included in the prototype scope.
- Protect unsaved edits and clearly indicate save status.

### FR-05 — Template A: Theory CIE
- Represent fields ACT, AAss, AST, ATT and total CIE as defined by the authoritative template/source.
- Support entry and editing by authorized faculty.
- Validate field presence and bounds using confirmed rules.
- Include best-two slip-test calculation only when the exact rule and eligible fields are confirmed.
- Do not assume absent/missing scores are zero.
- Do not invent rounding or normalization.
- Keep calculation logic in a reusable, testable domain function rather than burying it in UI components.

### FR-06 — Template C: Dynamic Lab Weekly CIE
- Support PEP, EXP, PEA, Record, and Conduct fields where those are confirmed in the source template.
- Support creating and managing weeks separately for each subject.
- Each week should have a stable identifier and, where required, a date.
- Support adding and editing weeks without accidentally modifying other subjects’ weeks.
- Display weekly total out of 30 only after the formula is confirmed.
- Calculate average CIE only after the aggregate formula and treatment of incomplete weeks are confirmed.
- Distinguish draft/incomplete weeks from completed weeks.
- Do not silently count incomplete weeks as zero or exclude them without an approved rule.

### FR-07 — Validation and feedback
- Validate on the client for usability and on the server for security/data integrity.
- Show field-level validation messages and a summary for failed submissions.
- Preserve user input after recoverable validation/server errors.
- Prevent duplicate submissions where practical.
- Provide accessible status messages; do not rely on color alone.

### FR-08 — Demo data
- Use synthetic names, roll numbers, subjects, and marks.
- Clearly label the environment/data as demo.
- Keep sample values internally consistent with the documented rules.
- If formulas are pending, use values only for layout/workflow demonstration and label derived totals as illustrative—not official.
- Never seed real personal or academic records without explicit authorization and appropriate protections.

## 7. Non-functional requirements

- **Security:** server-side authentication/authorization; deny by default.
- **Data integrity:** authoritative values must not be controlled by browser state.
- **Accessibility:** keyboard operability, visible focus, semantic labels, sufficient contrast, reduced-motion support.
- **Responsive design:** usable on mobile, tablet, and desktop.
- **Performance:** avoid unnecessary re-renders, oversized animation assets, and excessive dependencies.
- **Reliability:** explicit loading, empty, error, saving, saved, and unsaved states.
- **Maintainability:** typed data contracts, reusable components, isolated domain calculations, and automated tests for business rules.
- **Privacy:** use synthetic data in demos; do not expose secrets or sensitive records.
- **Observability:** failures should be diagnosable without logging passwords, tokens, or unnecessary personal data.

## 8. Content and visual integrity

- Source documents and approved templates are authoritative for features and academic terminology.
- No source → no feature claim.
- No evidence → no metric/testimonial/approval claim.
- Do not create fake system status indicators such as “live sync active” unless a real implementation supports them.
- Product visuals must reflect actual implemented UI or be explicitly labelled as illustrative.
- Avoid generic AI-product language, decorative dashboard mockups with fabricated data, and repetitive feature-card sections.

## 9. Open decisions — do not guess

The following must be resolved from official templates/policies or left explicitly pending:
- Exact Template A formula and component maximums.
- Exact definition and eligible set for “best two” slip tests.
- Whether ACT, AAss, AST, ATT are raw or normalized scores and how normalization works.
- Exact Template C component maximums and weekly formula.
- Average CIE formula and whether all weeks or completed weeks are included.
- Treatment of absent, excused absence, missing, withheld, and late-entered marks.
- Rounding rules and precision.
- Whether a submitted mark can be edited, by whom, and under what approval/audit workflow.
- Official academic period, course, section, and enrollment data sources.
- Demo authentication/persistence approach.
- Whether any backend workflow is expected in the current milestone.

## 10. Acceptance summary

The prototype is ready for review when:
- Student and Faculty entry paths work end-to-end in the intended demo environment.
- Student records are isolated to the signed-in demo student.
- Faculty records are isolated to assigned demo subjects/sections.
- Template A and Template C can be opened and used within confirmed rules.
- Unconfirmed calculations are not presented as official.
- Dynamic lab weeks are isolated per subject.
- Form validation and error states are functional.
- Responsive and keyboard testing has been performed.
- No existing project functionality has been silently removed.
- Build, lint, and relevant tests pass.
