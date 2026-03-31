import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { subjects } from '../data/subjects'

const subjectColors = {
  algorithms: { light: '#EDE9FE', dark: '#7C3AED' },
  physics: { light: '#FEF3C7', dark: '#D97706' },
  fds: { light: '#D1FAE5', dark: '#059669' },
  maths: { light: '#DBEAFE', dark: '#2563EB' },
}

const fixedBreakdowns = {
  physics: {
    totalHours: 83,
    typeRows: [
      { type: 'Lecture', hours: 43 },
      { type: 'Workshop', hours: 20 },
      { type: 'Quiz', hours: 5 },
      { type: 'Notes', hours: 10 },
      { type: 'Review', hours: 5 },
    ],
  },
  algorithms: {
    totalHours: 84,
    typeRows: [
      { type: 'Lecture', hours: 35 },
      { type: 'Tutorial', hours: 20 },
      { type: 'Quiz', hours: 4 },
      { type: 'Labs', hours: 5 },
      { type: 'Notes', hours: 10 },
      { type: 'Past Paper', hours: 10 },
    ],
  },
  fds: {
    totalHours: 60,
    typeRows: [
      { type: 'Lecture', hours: 31 },
      { type: 'Workshop', hours: 7 },
      { type: 'Labs', hours: 6 },
      { type: 'Notes', hours: 8 },
      { type: 'Past Paper', hours: 8 },
    ],
  },
  maths: {
    totalHours: 124,
    typeRows: [
      { type: 'Lecture', hours: 44 },
      { type: 'Workshop', hours: 60 },
      { type: 'Notes', hours: 10 },
      { type: 'Past Paper', hours: 10 },
    ],
  },
}

export default function ExamSummaryModal({ open, onClose }) {
  const globalMax = useMemo(() => {
    return Object.values(fixedBreakdowns).reduce((m, subj) => {
      const localMax = (subj.typeRows ?? []).reduce((mm, r) => Math.max(mm, r.hours), 0)
      return Math.max(m, localMax)
    }, 0)
  }, [])

  const rows = useMemo(() => {
    return [...subjects]
      .sort((a, b) => String(a.examDate).localeCompare(String(b.examDate)))
      .map((s) => {
        const fixed = fixedBreakdowns[s.id] ?? { totalHours: 0, typeRows: [] }
        return { subject: s, totalHours: fixed.totalHours, typeRows: fixed.typeRows }
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

      <div className="relative w-full max-w-[820px] rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-slate-900">Exam summary</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:ring-1 hover:ring-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-4 pb-4 pt-3">
          {rows.map((r, idx) => {
            const c = subjectColors[r.subject.id] ?? { light: '#f1f5f9', dark: '#0f172a' }
            const max = globalMax || 1

            return (
              <div
                key={r.subject.id}
                className={`${idx === rows.length - 1 ? '' : 'mb-3'}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center rounded-full text-[12px] font-semibold"
                    style={{
                      backgroundColor: c.light,
                      color: c.dark,
                      padding: '2px 9px',
                      borderRadius: 999,
                    }}
                  >
                    {r.subject.short ?? r.subject.id}
                  </span>
                  <div className="text-[12px] text-slate-500">
                    Exam {format(parseISO(r.subject.examDate), 'MMM d, yyyy')}
                  </div>
                  <div className="ml-auto text-[12px] font-medium text-slate-500">
                    {r.totalHours}h total
                  </div>
                </div>

                <div className="mt-2 space-y-0">
                  {r.typeRows.map((tr) => {
                    const widthPct = Math.max(0, Math.min(100, (tr.hours / max) * 100))
                    return (
                      <div key={tr.type} className="flex items-center gap-3 py-0.5">
                        <div className="min-w-[150px] text-[12px] text-[#374151]">
                          {tr.type}
                        </div>
                        <div className="flex-1">
                          <div
                            className="h-[5px] rounded-full"
                            style={{
                              width: `${widthPct}%`,
                              backgroundColor: c.dark,
                              borderRadius: 999,
                            }}
                          />
                        </div>
                        <div className="w-[48px] text-right text-[12px] text-[#6b7280]">
                          {tr.hours}h
                        </div>
                      </div>
                    )
                  })}
                </div>
                {idx !== rows.length - 1 ? <div className="mt-3 border-b border-slate-200" /> : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

