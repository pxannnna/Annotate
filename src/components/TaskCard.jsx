import { classesForSubject, subjectById } from '../data/subjects'

export default function TaskCard({ task, onToggleDone, onEdit, onDelete }) {
  const cls = classesForSubject(task.subject)
  const subj = subjectById(task.subject)
  const subjectLabel = subj?.chip ?? (task.subject === 'personal' ? 'Personal' : task.subject)

  const muted = task.done

  return (
    <div
      className={`group relative rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition ${
        muted ? 'opacity-60' : 'hover:shadow-md'
      }`}
      style={{ borderLeftWidth: 6 }}
    >
      <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-xl ${cls.chip}`} />

      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-black/5 ${cls.chip}`}
            >
              {subjectLabel}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              {task.type}
            </span>
            {!task.isExam && !task.isHoliday && !task.isPersonal && (
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white">
                {task.hours}h
              </span>
            )}
            {task.isExam && (
              <span className="rounded-full bg-exam px-2 py-0.5 text-[11px] font-extrabold text-white">
                EXAM
              </span>
            )}
            {task.isHoliday && (
              <span className="rounded-full bg-holiday px-2 py-0.5 text-[11px] font-extrabold text-white">
                ✈ Holiday
              </span>
            )}
          </div>

          <div
            className={`mt-2 text-sm font-semibold text-slate-900 ${
              muted ? 'line-through' : ''
            }`}
          >
            {task.name}
          </div>

          {task.notes ? (
            <div className="mt-1 text-xs text-slate-600">{task.notes}</div>
          ) : null}
        </div>

        <div className="flex items-start gap-2">
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={!!task.done}
              onChange={() => onToggleDone(task.id)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
          </label>

          <button
            type="button"
            onClick={() => onEdit(task)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            title="Edit"
          >
            ✎
          </button>

          <button
            type="button"
            onClick={() => {
              // eslint-disable-next-line no-alert
              if (confirm('Delete this task?')) onDelete(task.id)
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}

