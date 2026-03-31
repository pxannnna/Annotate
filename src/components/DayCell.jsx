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
  const isEvent = task.isHoliday || task.isPersonal
  const isExam = task.isExam

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex min-w-0 items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold shadow-sm ring-1 ring-black/5 transition ${
        task.done
          ? 'bg-slate-200 text-slate-600 line-through opacity-80'
          : isExam
            ? 'bg-slate-900 text-white'
            : isEvent
              ? 'pill-event shadow-none ring-0'
              : `${cls.chip} ring-slate-200`
      } ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} ${
        isDragging ? 'opacity-70' : ''
      }`}
      {...attributes}
      {...listeners}
      title={task.name}
    >
      {!isExam && !isEvent && (
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cls.border.replace('border-', 'bg-')}`} />
      )}
      <span className="min-w-0 flex-1 truncate">
        {task.isHoliday ? '✈ ' : task.isPersonal ? '🎉 ' : ''}
        {task.name}
      </span>
      {!isExam && !isEvent && (
        <span className="rounded-full bg-black/8 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
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

  const highlightColor = isToday ? '#a78bfa' : isOver ? '#cbd5e1' : null
  const highlightStyle = highlightColor
    ? { boxShadow: `inset 0 0 0 2px ${highlightColor}` }
    : undefined

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      style={highlightStyle}
      className={`relative flex min-h-[124px] w-full flex-col items-start justify-start border-b border-r border-t-0 border-l-0 border-slate-200 p-2 pb-6 text-left transition-[background-color,box-shadow] hover:bg-slate-50 focus:outline-none ${
        !inMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white'
      } ${isToday ? 'hover:bg-violet-50' : ''} ${
        hasHoliday ? 'bg-sky-50/60' : ''
      }`}
    >
      {hasExam && (
        <div className="absolute left-0 top-0 w-full rounded-tl-[14px] rounded-tr-[14px] bg-exam px-2 py-1 text-[11px] font-extrabold text-white shadow-sm">
          📝 EXAM
        </div>
      )}

      <div className={`flex w-full items-center justify-between ${hasExam ? 'pt-5' : ''}`}>
        <div className="text-xs font-semibold text-slate-700">{format(date, 'd')}</div>
        {isAllDone ? (
          <span
            className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-800 shadow-sm"
            title="All done"
          >
            ✓
          </span>
        ) : (
          <span />
        )}
      </div>

      <div className={`mt-1 flex w-full flex-col items-stretch justify-start gap-1.5 ${hasExam ? 'pt-1' : ''}`}>
        {shown.map((t) => (
          <TaskPill key={t.id} task={t} />
        ))}
        {extra > 0 && (
          <div className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
            +{extra} more
          </div>
        )}
      </div>

      {hours > 0 ? (
        <div className="absolute bottom-2 right-2 text-[11px] font-semibold text-slate-500">
          {hours}h
        </div>
      ) : null}
    </button>
  )
}

