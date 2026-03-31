import { useDroppable, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { classesForSubject } from '../data/subjects'

function TaskPill({ task }) {
  const draggable = !(task.isExam || task.isHoliday || task.isPersonal)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: !draggable,
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined
  const cls = classesForSubject(task.subject)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex min-w-0 items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold shadow-sm ring-1 ring-black/5 transition ${
        task.done ? 'bg-slate-200 text-slate-600 line-through opacity-80' : cls.chip
      } ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} ${
        isDragging ? 'opacity-70' : ''
      }`}
      {...attributes}
      {...listeners}
      title={task.name}
    >
      <span className="min-w-0 flex-1 truncate">{task.name}</span>
      {!task.isExam && !task.isHoliday && !task.isPersonal && (
        <span className="rounded-full bg-white/18 px-1.5 py-0.5 text-[10px] font-bold">
          {task.hours}h
        </span>
      )}
    </div>
  )
}

export default function DayCell({
  date,
  dateStr,
  inMonth,
  isToday,
  isSelected,
  isAllDone,
  hours,
  visibleTasks,
  hasHoliday,
  hasBall,
  hasExam,
  onClick,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dateStr })
  const shown = visibleTasks.slice(0, 3)
  const extra = Math.max(0, visibleTasks.length - shown.length)

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      className={`relative min-h-[112px] w-full border-b border-r border-slate-200 p-2 text-left transition hover:bg-slate-50 focus:outline-none ${
        !inMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white'
      } ${isOver ? 'ring-2 ring-slate-300' : ''} ${
        isToday ? 'ring-2 ring-slate-400' : ''
      } ${isSelected ? 'outline outline-2 outline-slate-300' : ''} ${
        hasHoliday ? 'bg-sky-50/60' : ''
      }`}
    >
      {hasExam && (
        <div className="absolute left-0 top-0 w-full rounded-tl-[14px] rounded-tr-[14px] bg-exam px-2 py-1 text-[11px] font-extrabold text-white shadow-sm">
          📝 EXAM
        </div>
      )}

      <div className={`flex items-center justify-between ${hasExam ? 'pt-6' : ''}`}>
        <div className="text-xs font-semibold text-slate-700">{format(date, 'd')}</div>
        <div className="flex items-center gap-1 text-xs">
          {hasHoliday && <span title="Holiday">✈</span>}
          {hasBall && <span title="Event">🎉</span>}
          {isAllDone && (
            <span
              className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-800 shadow-sm"
              title="All done"
            >
              ✓
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1.5">
        {shown.map((t) => (
          <TaskPill key={t.id} task={t} />
        ))}
        {extra > 0 && (
          <div className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
            +{extra} more
          </div>
        )}
      </div>

      <div className="absolute bottom-2 right-2 text-[11px] font-semibold text-slate-500">
        {hours > 0 ? `${hours}h` : ''}
      </div>
    </button>
  )
}

