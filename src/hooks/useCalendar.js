import { useCallback, useMemo, useState } from 'react'
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'

export function useCalendar() {
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()))
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
    setViewDate(startOfMonth(now))
    setSelectedDate(now)
  }, [])

  const gridDays = useMemo(() => {
    if (weekView) {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
      return Array.from({ length: 7 }, (_, i) => addDays(start, i))
    }

    const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 })
    const days = []
    let d = start
    while (d <= end) {
      days.push(d)
      d = addDays(d, 1)
    }
    return days
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

