import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { format } from 'date-fns'
import { subjects, classesForSubject } from '../data/subjects'
import DayCell from './DayCell'

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Calendar({ calendar, tasksApi, onOpenDay, onAddTask }) {
  const filterStyles = {
    algorithms: { bg: '#EDE9FE', text: '#7C3AED' },
    physics: { bg: '#FEF3C7', text: '#D97706' },
    fds: { bg: '#D1FAE5', text: '#059669' },
    maths: { bg: '#DBEAFE', text: '#2563EB' },
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

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
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={calendar.goToday}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => calendar.setWeekView((v) => !v)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {calendar.weekView ? 'Month view' : 'Week view'}
          </button>
          <button
            type="button"
            onClick={() => onAddTask(format(calendar.selectedDate, 'yyyy-MM-dd'))}
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1 text-xs font-semibold text-slate-500">Filter</div>
          {subjects.map((s) => {
            const active = tasksApi.filters[s.id] !== false
            const st = filterStyles[s.id]
            const activeStyle = active && st ? { backgroundColor: st.bg, color: st.text, borderColor: st.bg } : undefined
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
              />
            )
          })}
        </div>
      </DndContext>
    </div>
  )
}

