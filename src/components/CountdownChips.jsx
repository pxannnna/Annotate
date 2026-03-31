import { differenceInCalendarDays, parseISO } from 'date-fns'
import { subjects, classesForSubject } from '../data/subjects'

export default function CountdownChips() {
  const now = new Date()
  return (
    <div className="flex items-center gap-2">
      {subjects.map((s) => {
        const days = differenceInCalendarDays(parseISO(s.examDate), now)
        const cls = classesForSubject(s.id)
        return (
          <div
            key={s.id}
            className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition hover:bg-slate-50 ${cls.chip}`}
            title={s.name}
          >
            <span className={`h-2 w-2 rounded-full ${cls.border.replace('border-', 'bg-')}`} />
            <span className="opacity-95">{s.short}</span>
            <span className="rounded-full bg-black/6 px-2 py-0.5 text-[11px] font-bold text-slate-700">
              {days} days
            </span>
          </div>
        )
      })}
    </div>
  )
}

