import { useCallback, useMemo, useState } from 'react'
import {
  addDays,
  addMonths,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'

export function useCalendar() {
  // Month view is a rolling 6-week window starting from the week containing viewDate.
  // We initialize viewDate to today so "today" is always in the top row initially.
  const [viewDate, setViewDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [weekView, setWeekView] = useState(false)

  const monthLabel = useMemo(() => format(viewDate, 'MMMM yyyy'), [viewDate])

  const goPrev = useCallback(() => {
    setViewDate((d) => (weekView ? addDays(d, -7) : subMonths(d, 1)))
  }, [weekView])

  const goNext = useCallback(() => {
    setViewDate((d) => (weekView ? addDays(d, 7) : addMonths(d, 1)))
  }, [weekView])

  const goToday = useCallback(() => {
    const now = new Date()
    setViewDate(now)
    setSelectedDate(now)
  }, [])

  const gridDays = useMemo(() => {
    if (weekView) {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
      return Array.from({ length: 7 }, (_, i) => addDays(start, i))
    }

    const start = startOfWeek(viewDate, { weekStartsOn: 1 })
    // Always show a full 6-week grid so the layout is stable.
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }, [viewDate, weekView, selectedDate])

  const isInViewMonth = useCallback(
    (date) => (weekView ? true : isSameMonth(date, viewDate)),
    [viewDate, weekView],
  )

  return {
    viewDate,
    setViewDate,
    selectedDate,
    setSelectedDate,
    weekView,
    setWeekView,
    monthLabel,
    gridDays,
    goPrev,
    goNext,
    goToday,
    isInViewMonth,
  }
}

