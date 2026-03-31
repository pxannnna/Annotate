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
  const isHolidayEvent = (t) => t.isHoliday || String(t.type || '').toLowerCase() === 'holiday'
  const isCompSocEvent = (t) => String(t.type || '').toLowerCase() === 'compsoc'
  const isPersonalEvent = (t) => t.isPersonal || String(t.type || '').toLowerCase() === 'personal'

  const topEvents = visibleTasks.filter((t) => isHolidayEvent(t) || isCompSocEvent(t) || isPersonalEvent(t))
  const examTask = visibleTasks.find((t) => t.isExam) ?? null
  const regularTasks = visibleTasks.filter(
    (t) => !(t.isExam || isHolidayEvent(t) || isCompSocEvent(t) || isPersonalEvent(t)),
  )

  const shown = regularTasks.slice(0, 3)
  const extra = Math.max(0, regularTasks.length - shown.length)

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
      className={`relative flex h-[156px] w-full flex-col items-start justify-start overflow-hidden border-b border-r border-t-0 border-l-0 border-slate-200 p-2 pb-6 text-left transition-[background-color,box-shadow] hover:bg-slate-50 focus:outline-none ${
        !inMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white'
      } ${isToday ? 'hover:bg-violet-50' : ''} ${
        examTask ? 'bg-rose-50' : hasHoliday ? 'bg-sky-50/60' : ''
      }`}
    >
      <div
        className="absolute left-0 top-0 h-full"
        style={examTask ? { width: 3, backgroundColor: '#f43f5e' } : undefined}
      />

      <div className={`flex w-full items-center justify-between ${examTask ? 'pt-0' : ''}`}>
        <div className="text-xs font-semibold text-slate-700">{format(date, 'd')}</div>
        {isAllDone && !examTask ? (
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

      {examTask ? (
        <div className="mt-1 w-full">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
            style={{ backgroundColor: '#f43f5e' }}
          >
            EXAM
          </span>
          <div className="mt-1 truncate text-sm font-bold text-slate-800">
            {String(examTask.name).replace(/^EXAM\s+—\s+/i, '')}
          </div>
        </div>
      ) : null}

      {topEvents.length > 0 ? (
        <div className="mt-1 w-full space-y-1">
          {topEvents.slice(0, 2).map((ev) => {
            const lowerType = String(ev.type || '').toLowerCase()
            const isHoliday = isHolidayEvent(ev)
            const isCompSoc = lowerType === 'compsoc'
            const isBall = ev.isPersonal && String(ev.name || '').toLowerCase().includes('ball')

            const bannerClasses = isCompSoc
              ? 'border border-solid border-slate-200 bg-slate-50 text-slate-700'
              : isHoliday
                ? 'border border-dashed border-[#7dd3fc] bg-[#f0f9ff] text-[#0284c7]'
                : isBall
                  ? 'border border-dashed border-[#f0abfc] bg-[#fdf2f8] text-[#a21caf]'
                  : 'border border-dashed border-slate-300 bg-slate-50 text-slate-600'

            return (
              <div
                key={ev.id}
                className={`flex h-5 w-full items-center gap-1.5 rounded-[4px] px-2 text-[11px] font-medium ${bannerClasses}`}
                title={ev.name}
              >
                {isCompSoc ? (
                  <img
                    src="/compsoc.png"
                    alt=""
                    className="h-3.5 w-3.5 rounded-[3px] object-contain"
                  />
                ) : (
                  <span className="leading-none">{isHoliday ? '✈' : isBall ? '🎉' : '•'}</span>
                )}
                <span className="min-w-0 flex-1 truncate">{ev.name}</span>
              </div>
            )
          })}
        </div>
      ) : null}

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
        <div className="absolute bottom-2 right-2 text-[11px] font-medium text-[#6b7280]">
          {hours}h
        </div>
      ) : null}
    </button>
  )
}

