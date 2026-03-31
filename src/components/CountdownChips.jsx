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
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-black/5 ${cls.chip}`}
            title={s.name}
          >
            <span className="opacity-95">{s.chip}</span>
            <span className="rounded-full bg-white/18 px-2 py-0.5 text-[11px] font-bold">
              {days} days
            </span>
          </div>
        )
      })}
    </div>
  )
}

