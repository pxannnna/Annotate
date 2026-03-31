# anna's revision planner

A clean, local-first revision planner that lets you see your schedule at a glance, track progress per subject, and reschedule tasks by dragging them between days.

- **Live site**: `https://annotate-smoky.vercel.app`

## What it does

- **Pre-loads a full revision plan** (lectures/tutorials/past papers) on first run via `localStorage` using a `hasInitialised` flag
- **Calendar month/week view** with navigation + “Today” jump
- **Day detail panel** to see all tasks for a day and tick them off
- **Progress sidebar** per subject (tasks done %, hours done vs planned) + today’s tasks
- **Drag & drop rescheduling**: drag a task pill onto another day to change its date
- **Subject filters**: hide/show subjects on the calendar without deleting tasks
- **Special days**: exam banner, Portugal holiday days (✈), and Ball evening (🎉)

## Tech stack

- **React 18** + **Vite**
- **Tailwind CSS**
- **@dnd-kit/core** and **@dnd-kit/sortable** for drag-and-drop
- **date-fns** for date logic
- **uuid** for task IDs
- **localStorage** (no backend)

## Project structure

```
src/
  components/
    Calendar.jsx
    DayCell.jsx
    DayDetailPanel.jsx
    TaskCard.jsx
    AddEditModal.jsx
    SubjectSidebar.jsx
    CountdownChips.jsx
  hooks/
    useTasks.js
    useCalendar.js
  data/
    initialTasks.js
    subjects.js
  App.jsx
  main.jsx
  index.css
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
