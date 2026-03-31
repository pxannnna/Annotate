import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { subjects } from '../data/subjects'

const subjectProgressStyles = {
  algorithms: { light: '#EDE9FE', dark: '#7C3AED' },
  physics: { light: '#FEF3C7', dark: '#D97706' },
  fds: { light: '#D1FAE5', dark: '#059669' },
  maths: { light: '#DBEAFE', dark: '#2563EB' },
}

function ProgressBar({ value, trackColor, fillColor }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: trackColor, borderRadius: 999 }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export default function SubjectSidebar({ tasksApi, onSelectDate }) {
  const now = new Date()
  const sortedSubjects = [...subjects].sort((a, b) =>
    String(a.examDate).localeCompare(String(b.examDate)),
  )

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl border border-slate-200/70 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Subjects</div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
            progress
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {sortedSubjects.map((s) => {
            const prog = tasksApi.getSubjectProgress(s.id)
            const days = differenceInCalendarDays(parseISO(s.examDate), now)
            const st = subjectProgressStyles[s.id] ?? { light: '#f1f5f9', dark: '#0f172a' }
            return (
              <div
                key={s.id}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-slate-200"
                style={{ borderLeftWidth: 4, borderLeftColor: st.dark }}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 truncate text-sm font-semibold leading-snug text-slate-900">
                        {s.full}
                      </div>
                      <span
                        className="shrink-0 rounded-full text-[12px] font-semibold"
                        style={{
                          backgroundColor: st.light,
                          color: st.dark,
                          padding: '2px 10px',
                          borderRadius: 999,
                        }}
                      >
                        {prog.pct}%
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Exam {format(parseISO(s.examDate), 'MMM d')} · {days} days left
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div
                    className="h-2 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: st.light, borderRadius: 999 }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(0, Math.min(100, prog.pct))}%`,
                        backgroundColor: st.dark,
                        borderRadius: 999,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-900">{prog.doneHours}</span>h
                    {' done'}
                  </div>
                  <div className="text-[12px] text-[#9ca3af]">
                    {prog.doneTasks}/{prog.totalTasks}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{prog.plannedHours}</span>h
                    {' planned'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Today&apos;s tasks</div>
          <div className="text-xs text-slate-500">{tasksApi.todaysTasks.length}</div>
        </div>

        <div className="mt-3 space-y-2">
          {tasksApi.todaysTasks.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
              No tasks today.
            </div>
          ) : (
            tasksApi.todaysTasks.slice(0, 6).map((t) => {
              const cls = classesForSubject(t.subject)
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectDate(parseISO(t.date))}
                  className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs transition hover:bg-slate-50 hover:ring-1 hover:ring-slate-200"
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${cls.chip}`} />
                  <span className={`min-w-0 flex-1 truncate ${t.done ? 'line-through opacity-60' : ''}`}>
                    {t.name}
                  </span>
                  {!t.isExam && !t.isHoliday && !t.isPersonal && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {t.hours}h
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

