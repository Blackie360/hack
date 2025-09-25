## Task 2 – Layout & Sidebar Navigation
- Create a responsive layout with a fixed left sidebar.
- Sidebar items: Dashboard, Take Attendance, Students List, Reports, Settings, Logout.
- Use Tailwind CSS `flex` and `min-h-screen` for full height.
- Add active link highlighting using `next/router`.

## Task 3 – Top Bar (Header)
- Add a top header with:
  - Search box (for Student ID look-up).
  - Current time display (auto-updates every minute).
  - Notification bell icon.
  - User avatar/profile dropdown.
- Implement sticky positioning so it stays visible while scrolling.

## Task 4 – Attendance Overview Chart
- Use [Recharts](https://recharts.org/) for a smooth line/area chart.
- Fetch attendance stats from your API.
- Add a dropdown to switch between time ranges (last 6 months, last year).

## Task 5 – Calendar & Notice Widgets
- Right-side card layout:
  - Calendar component 
  - Notice list with upcoming events/exams pulled from the backend.

## Task 6 – Africastalking SMS Integration
- Hook attendance events to Africastalking’s SMS API.
- When a teacher marks a student absent, trigger an SMS to the parent/guardian.

## Task 7 – Testing, Deployment, & Final Polish
- Write Cypress or Playwright end-to-end tests.
- Deploy to Vercel.
- Final UI/UX review, performance check, and accessibility audit.