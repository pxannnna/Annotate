import { useMemo, useState } from 'react'
import { subjects, classesForSubject } from '../data/subjects'

const subjectOptions = [
  ...subjects.map((s) => ({ id: s.id, label: s.name })),
  { id: 'personal', label: 'Personal' },
]

const typeOptions = [
  'Lecture',
  'Tutorial',
  'Workshop',
  'Quiz',
  'Labs',
  'Notes',
  'Past Paper',
  'Review',
  'Rest',
  'Personal',
  'Holiday',
  'CompSoc',
]

export default function AddEditModal({ mode, task, onClose, onSave }) {
  const [draft, setDraft] = useState(task)
  const cls = classesForSubject(draft.subject)

  const title = mode === 'edit' ? 'Edit task' : 'Add task'

  const canSave = useMemo(() => {
    if (!draft.name.trim()) return false
    if (!draft.date) return false
    if (!draft.subject) return false
    if (!draft.type) return false
    if (draft.subject !== 'personal' && !Number.isFinite(Number(draft.hours))) return false
    return true
  }, [draft])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/35"
        aria-label="Close modal"
      />

      <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className={`px-5 py-4 ${cls.chip}`}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold tracking-tight text-white">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white transition hover:bg-white/20"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-1 text-xs text-white/85">
            Pick a subject first for the accent colour.
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <div className="text-xs font-semibold text-slate-600">Subject</div>
              <select
                value={draft.subject}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, subject: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                {subjectOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <div className="text-xs font-semibold text-slate-600">Type</div>
              <select
                value={draft.type}
                onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-1">
            <div className="text-xs font-semibold text-slate-600">Task title</div>
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. Past paper 2019 Qs 1–4"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <div className="text-xs font-semibold text-slate-600">Date</div>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </label>

            <label className="space-y-1">
              <div className="text-xs font-semibold text-slate-600">Hours</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({ ...d, hours: Math.max(0, (Number(d.hours) || 0) - 1) }))
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                  aria-label="Decrease hours"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={draft.hours}
                  onChange={(e) => setDraft((d) => ({ ...d, hours: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <button
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({ ...d, hours: (Number(d.hours) || 0) + 1 }))
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                  aria-label="Increase hours"
                >
                  +
                </button>
              </div>
            </label>
          </div>

          <label className="space-y-1">
            <div className="text-xs font-semibold text-slate-600">Notes (optional)</div>
            <textarea
              value={draft.notes ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              className="min-h-[84px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Anything you want to remember…"
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={() => onSave(draft)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

