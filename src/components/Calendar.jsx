import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { subjects } from '../data/subjects'
import DayCell from './DayCell'

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function TodayPanel({ tasks, tasksApi, onEditTask }) {
  const done = tasks.filter((t) => t.done)
  const plannedHours = tasks.reduce((sum, t) => {
    if (t.isExam || t.isHoliday || t.isPersonal) return sum
    return sum + (Number(t.hours) || 0)
  }, 0)

  const doneDots = useMemo(() => {
    const ids = []
    for (const t of done) {
      if (!t.subject || t.subject === 'personal') continue
      if (!ids.includes(t.subject)) ids.push(t.subject)
    }
    return ids.slice(0, 6)
  }, [done])

  const dotColor = {
    algorithms: '#7C3AED',
    physics: '#D97706',
    fds: '#059669',
    maths: '#2563EB',
  }

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <div className="text-3xl">☀️</div>
        <div className="text-sm font-semibold text-slate-900">
          Nothing scheduled today — enjoy the break!
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
          {tasks.length} tasks today
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
          {plannedHours}h planned
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
          <span>{done.length} done</span>
          <span className="flex items-center gap-1">
            {doneDots.map((id) => (
              <span
                key={id}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: dotColor[id] ?? '#94a3b8' }}
              />
            ))}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((t) => {
          const subjectColor = dotColor[t.subject] ?? '#94a3b8'
          return (
            <div
              key={t.id}
              className={`group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 ease-in-out ${
                t.done ? 'translate-x-[6px] opacity-40' : ''
              }`}
              style={{ borderLeftWidth: 4, borderLeftColor: subjectColor }}
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: 'rgba(148,163,184,0.22)', color: '#334155' }}
                    >
                      {t.subject === 'algorithms'
                        ? 'AIDS'
                        : t.subject === 'physics'
                          ? 'Physics'
                          : t.subject === 'fds'
                            ? 'FDS'
                            : t.subject === 'maths'
                              ? 'Maths'
                              : 'Event'}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {t.type}
                    </span>
                    {!t.isExam && !t.isHoliday && !t.isPersonal ? (
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                        {t.hours}h
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={`mt-2 text-[16px] font-medium text-slate-900 ${
                      t.done ? 'line-through' : ''
                    }`}
                  >
                    {t.name}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={!!t.done}
                      onChange={() => tasksApi.toggleDone(t.id)}
                      className="h-6 w-6 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      aria-label="Mark done"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => onEditTask?.(t)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 opacity-0 transition hover:bg-slate-50 group-hover:opacity-100"
                    title="Edit"
                    aria-label="Edit task"
                  >
                    ✎
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Calendar({ calendar, tasksApi, onOpenDay, onAddTask, onEditTask }) {
  const filterStyles = {
    algorithms: { bg: '#EDE9FE', text: '#7C3AED' },
    physics: { bg: '#FEF3C7', text: '#D97706' },
    fds: { bg: '#D1FAE5', text: '#059669' },
    maths: { bg: '#DBEAFE', text: '#2563EB' },
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [todayMode, setTodayMode] = useState(false)

  const todayDate = useMemo(() => new Date(), [])
  const todayStr = useMemo(() => format(todayDate, 'yyyy-MM-dd'), [todayDate])
  const todayLabel = useMemo(() => format(todayDate, 'EEEE, d MMMM'), [todayDate])
  const todayTasks = tasksApi.tasksByDate.get(todayStr) ?? []

  const onDragEnd = (event) => {
    const taskId = event.active?.id
    const overDateStr = event.over?.id
    if (!taskId || !overDateStr) return

    const t = tasksApi.tasks.find((x) => x.id === taskId)
    if (!t) return
    if (t.isExam || t.isHoliday || t.isPersonal) return
    if (t.date === overDateStr) return
    tasksApi.moveTask(taskId, overDateStr)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          {!todayMode ? (
            <>
              <button
                type="button"
                onClick={calendar.goPrev}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={calendar.goNext}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                aria-label="Next"
              >
                ›
              </button>
              <div className="ml-2 text-sm font-semibold text-slate-900">{calendar.monthLabel}</div>
            </>
          ) : (
            <div className="text-sm font-semibold text-slate-900">{todayLabel}</div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTodayMode(true)
              calendar.goToday()
            }}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              todayMode
                ? 'border-transparent bg-violet-50 text-violet-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => {
              if (todayMode) setTodayMode(false)
              else calendar.setWeekView((v) => !v)
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {todayMode ? 'Month view' : calendar.weekView ? 'Month view' : 'Week view'}
          </button>
        </div>
      </div>

      {!todayMode ? (
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 text-xs font-semibold text-slate-500">Filter</div>
            {subjects.map((s) => {
              const active = tasksApi.filters[s.id] !== false
              const st = filterStyles[s.id]
              const activeStyle =
                active && st ? { backgroundColor: st.bg, color: st.text, borderColor: st.bg } : undefined
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => tasksApi.toggleFilter(s.id)}
                  style={activeStyle}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition hover:bg-slate-50 ${
                    active ? 'border-transparent' : 'border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                  title={active ? 'Hide' : 'Show'}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: active && st ? st.text : '#94a3b8' }}
                  />
                  {s.short}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <div className="relative">
        <div
          className={`transition-opacity duration-200 ${todayMode ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        >
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70">
            {weekdayLabels.map((d) => (
              <div key={d} className="px-3 py-2 text-xs font-semibold text-slate-600">
                {d}
              </div>
            ))}
          </div>

          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <div className="grid grid-cols-7 auto-rows-fr">
              {calendar.gridDays.map((d) => {
                const dateStr = format(d, 'yyyy-MM-dd')
                const allTasks = tasksApi.tasksByDate.get(dateStr) ?? []
                const visibleTasks = tasksApi.getVisibleTasksForDateString(dateStr)
                const isToday = dateStr === format(new Date(), 'yyyy-MM-dd')
                const isAllDone = tasksApi.isDayAllDone(dateStr)
                const hours = tasksApi.getHoursTotal(dateStr, { onlyVisible: true, onlyUndone: false })
                const hasHoliday = allTasks.some((t) => t.isHoliday)
                const hasBall = allTasks.some((t) => t.isPersonal && t.name.toLowerCase().includes('ball'))
                const hasExam = allTasks.some((t) => t.isExam)

                return (
                  <DayCell
                    key={dateStr}
                    date={d}
                    dateStr={dateStr}
                    inMonth={calendar.isInViewMonth(d)}
                    isToday={isToday}
                    isAllDone={isAllDone}
                    hours={hours}
                    visibleTasks={visibleTasks}
                    hasHoliday={hasHoliday}
                    hasBall={hasBall}
                    hasExam={hasExam}
                    onClick={() => onOpenDay(d)}
                    onAdd={() => onAddTask(dateStr)}
                  />
                )
              })}
            </div>
          </DndContext>
        </div>

        <div className={`absolute inset-0 transition-opacity duration-200 ${todayMode ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="p-4">
            <TodayPanel tasks={todayTasks} tasksApi={tasksApi} onEditTask={onEditTask} />
          </div>
        </div>
      </div>
    </div>
  )
}

