import { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { format, isSameMonth, parseISO, startOfMonth } from 'date-fns'
import { subjects } from './data/subjects'
import { useCalendar } from './hooks/useCalendar'
import { useTasks } from './hooks/useTasks'
import CountdownChips from './components/CountdownChips'
import SubjectSidebar from './components/SubjectSidebar'
import Calendar from './components/Calendar'
import DayDetailPanel from './components/DayDetailPanel'
import AddEditModal from './components/AddEditModal'
import ExamSummaryModal from './components/ExamSummaryModal'

export default function App() {
  const calendar = useCalendar()
  const tasksApi = useTasks({ subjectIds: subjects.map((s) => s.id) })

  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [modalState, setModalState] = useState({ open: false, mode: 'add', task: null })
  const [didAutoJump, setDidAutoJump] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)

  const selectedDateStr = useMemo(
    () => format(calendar.selectedDate, 'yyyy-MM-dd'),
    [calendar.selectedDate],
  )

  const openDay = (date) => {
    calendar.setSelectedDate(date)
    setIsPanelOpen(true)
  }

  const openAdd = (dateStr = selectedDateStr) => {
    setModalState({
      open: true,
      mode: 'add',
      task: {
        id: uuidv4(),
        subject: subjects[0]?.id ?? 'algorithms',
        name: '',
        date: dateStr,
        hours: 1,
        type: 'Lecture',
        notes: '',
        done: false,
      },
    })
  }

  const openEdit = (task) => {
    setModalState({ open: true, mode: 'edit', task: { ...task } })
  }

  const closeModal = () => setModalState({ open: false, mode: 'add', task: null })

  const onSaveTask = (task) => {
    if (modalState.mode === 'add') tasksApi.addTask(task)
    else tasksApi.updateTask(task.id, task)
    closeModal()
  }

  const headerTodayLabel = useMemo(() => format(new Date(), 'EEE d MMM'), [])

  useEffect(() => {
    if (didAutoJump) return
    if (!tasksApi.tasks || tasksApi.tasks.length === 0) return

    const tasksInViewMonth = tasksApi.tasks.some((t) =>
      isSameMonth(parseISO(t.date), calendar.viewDate),
    )
    if (tasksInViewMonth) {
      setDidAutoJump(true)
      return
    }

    const earliest = tasksApi.tasks
      .map((t) => t.date)
      .sort((a, b) => a.localeCompare(b))[0]
    if (!earliest) return

    const target = startOfMonth(parseISO(earliest))
    calendar.setViewDate(target)
    calendar.setSelectedDate(parseISO(earliest))
    setDidAutoJump(true)
  }, [didAutoJump, tasksApi.tasks, calendar])

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-slate-200 border-t border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3">
          <div className="min-w-0">
            <div className="font-display text-xl leading-none tracking-tight text-slate-900 sm:text-2xl">
              My revision panner
            </div>
            <div className="mt-1 text-xs text-slate-500">Today: {headerTodayLabel}</div>
          </div>

          <div className="ml-2 hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto overflow-y-visible pb-1 md:flex">
            <CountdownChips />
          </div>

          <button
            type="button"
            onClick={() => setIsSummaryOpen(true)}
            className="hidden items-center rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:ring-1 hover:ring-slate-200 md:inline-flex"
          >
            Summary
          </button>

          <button
            type="button"
            onClick={() => openAdd()}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <span className="text-base leading-none">+</span>
            <span>Add task</span>
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[440px_1fr]">
        <aside className="order-2 lg:order-1">
          <SubjectSidebar tasksApi={tasksApi} onSelectDate={openDay} />
        </aside>

        <section className="order-1 lg:order-2">
          <Calendar
            calendar={calendar}
            tasksApi={tasksApi}
            onOpenDay={openDay}
            onAddTask={(dateStr) => openAdd(dateStr)}
          />
        </section>
      </main>

      <DayDetailPanel
        open={isPanelOpen}
        dateStr={selectedDateStr}
        tasks={tasksApi.tasksByDate.get(selectedDateStr) ?? []}
        onClose={() => setIsPanelOpen(false)}
        onAdd={() => openAdd(selectedDateStr)}
        onEdit={openEdit}
        onToggleDone={tasksApi.toggleDone}
        onDelete={tasksApi.deleteTask}
      />

      {modalState.open && (
        <AddEditModal
          mode={modalState.mode}
          task={modalState.task}
          onClose={closeModal}
          onSave={onSaveTask}
        />
      )}

      <ExamSummaryModal open={isSummaryOpen} onClose={() => setIsSummaryOpen(false)} />
    </div>
  )
}
