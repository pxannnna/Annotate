import { format, parseISO } from 'date-fns'
import TaskCard from './TaskCard'

export default function DayDetailPanel({
  open,
  dateStr,
  tasks,
  onClose,
  onAdd,
  onEdit,
  onToggleDone,
  onDelete,
}) {
  if (!open) return null

  const date = parseISO(dateStr)
  const title = format(date, 'EEEE, MMMM d')

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30"
        aria-label="Close day details"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500">Day details</div>
            <div className="truncate text-lg font-semibold text-slate-900">{title}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAdd}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              + Add task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-72px)] overflow-y-auto p-4">
          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              No tasks on this day yet.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggleDone={onToggleDone}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

