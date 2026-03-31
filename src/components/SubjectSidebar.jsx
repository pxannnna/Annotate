import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { classesForSubject, subjects } from '../data/subjects'

const subjectProgressStyles = {
  algorithms: { light: '#EDE9FE', dark: '#7C3AED' },
  physics: { light: '#FEF3C7', dark: '#D97706' },
  fds: { light: '#D1FAE5', dark: '#059669' },
  maths: { light: '#DBEAFE', dark: '#2563EB' },
}

function fmtPct(n, { approx = false } = {}) {
  if (!Number.isFinite(n)) return '—'
  const rounded = Math.round(n * 10) / 10
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded)
  return `${approx ? '~' : ''}${text}%`
}

function targetForSubject(subjectId) {
  // All targets are minimum exam % needed to reach 40% overall (pass threshold).
  const PASS_OVERALL = 40

  if (subjectId === 'physics') {
    return {
      mustPass: true,
      examWeightPct: 80,
      minExamPct: 40,
      approx: false,
      assumption: null,
    }
  }

  if (subjectId === 'maths') {
    return {
      mustPass: true,
      examWeightPct: 80,
      minExamPct: 40,
      approx: false,
      assumption: null,
    }
  }

  if (subjectId === 'fds') {
    const examWeight = 0.5
    const assumedCwPct = 70
    const cwOverallPct = assumedCwPct * 0.5
    const neededFromExamOverall = Math.max(0, PASS_OVERALL - cwOverallPct)
    const minExamPct = neededFromExamOverall / (examWeight * 100) * 100

    return {
      mustPass: false,
      examWeightPct: 50,
      minExamPct,
      approx: false,
      assumption: 'Assumed: coursework = 70%',
    }
  }

  if (subjectId === 'algorithms') {
    const examWeight = 0.6
    const cwWeight = 0.4
    const cw1 = 97
    const cw2Assumed = 80
    const cwAvg = (cw1 + cw2Assumed) / 2
    const cwOverallPct = cwAvg * cwWeight
    const neededFromExamOverall = Math.max(0, PASS_OVERALL - cwOverallPct)
    const minExamPct = neededFromExamOverall / (examWeight * 100) * 100

    return {
      mustPass: false,
      examWeightPct: 60,
      minExamPct,
      approx: true,
      assumption: 'Assumed: CW2 = 80/100',
    }
  }

  return null
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
                      {targetForSubject(s.id)?.mustPass ? (
                        <span className="shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 ring-1 ring-rose-200">
                          ⚠ Force fail
                        </span>
                      ) : null}
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

                {(() => {
                  const t = targetForSubject(s.id)
                  if (!t) return null
                  return (
                    <div className="mt-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Exam target
                      </div>

                      <div className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                            Exam: {t.examWeightPct}% of course
                          </span>
                          <span className="text-[11px] font-semibold text-slate-700">
                            Min. exam score needed:{' '}
                            <span className="font-extrabold" style={{ color: st.dark }}>
                              {fmtPct(t.minExamPct, { approx: t.approx })}
                            </span>
                          </span>
                        </div>
                      </div>

                      {t.assumption ? (
                        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] italic text-slate-500">
                          {t.assumption}
                        </div>
                      ) : null}
                    </div>
                  )
                })()}

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

