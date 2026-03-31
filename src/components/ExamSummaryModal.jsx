import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { initialTasks } from '../data/initialTasks'
import { subjects, classesForSubject } from '../data/subjects'

const preferredTypeOrder = [
  'Lecture',
  'Tutorial',
  'Workshop',
  'Problem Sheet',
  'Labs',
  'Quiz',
  'Notes',
  'Past Paper',
  'Review',
  'Rest',
]

function breakdownForSubject(subjectId) {
  const items = initialTasks.filter(
    (t) => t.subject === subjectId && !t.isExam && !t.isHoliday && !t.isPersonal,
  )

  const totalHours = items.reduce((s, t) => s + (Number(t.hours) || 0), 0)
  const totalTasks = items.length

  const byType = new Map()
  for (const t of items) {
    const key = t.type || 'Other'
    const prev = byType.get(key) ?? { type: key, count: 0, hours: 0 }
    byType.set(key, {
      type: key,
      count: prev.count + 1,
      hours: prev.hours + (Number(t.hours) || 0),
    })
  }

  const typeRows = Array.from(byType.values()).sort((a, b) => {
    const ai = preferredTypeOrder.indexOf(a.type)
    const bi = preferredTypeOrder.indexOf(b.type)
    const ao = ai === -1 ? 999 : ai
    const bo = bi === -1 ? 999 : bi
    if (ao !== bo) return ao - bo
    return a.type.localeCompare(b.type)
  })

  return { totalTasks, totalHours, typeRows }
}

export default function ExamSummaryModal({ open, onClose }) {
  const rows = useMemo(() => {
    return subjects.map((s) => {
      const totals = breakdownForSubject(s.id)
      return { subject: s, ...totals }
    })
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/35"
        aria-label="Close summary"
      />

      <div className="relative w-full max-w-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500">Fixed plan totals</div>
            <div className="truncate text-lg font-semibold text-slate-900">
              Exam summary (planned workload)
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:ring-1 hover:ring-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rows.map((r) => {
              const cls = classesForSubject(r.subject.id)
              return (
                <div
                  key={r.subject.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-slate-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${cls.border.replace('border-', 'bg-')}`} />
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {r.subject.short ?? r.subject.chip}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Exam {format(parseISO(r.subject.examDate), 'MMM d, yyyy')}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-700">
                        {r.subject.full ?? r.subject.name}
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-600">
                      <div className="text-base font-extrabold text-slate-900">{r.totalHours}h</div>
                      <div>{r.totalTasks} tasks</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {r.typeRows.map((tr) => (
                      <div
                        key={tr.type}
                        className="rounded-xl bg-slate-50 px-2.5 py-2 text-xs text-slate-700 ring-1 ring-slate-200"
                        title={tr.type}
                      >
                        <div className="truncate font-semibold text-slate-900">{tr.type}</div>
                        <div className="mt-0.5 flex items-center justify-between text-[11px] text-slate-600">
                          <span>{tr.count} items</span>
                          <span className="font-semibold text-slate-800">{tr.hours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
            These totals are calculated from the pre-loaded plan (the “fixed” workload) and don’t
            change when you reschedule tasks.
          </div>
        </div>
      </div>
    </div>
  )
}

