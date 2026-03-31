import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSameDay, parseISO } from 'date-fns'
import { initialTasks } from '../data/initialTasks'

const STORAGE_KEY_TASKS = 'revisionPlanner.tasks'
const STORAGE_KEY_FILTERS = 'revisionPlanner.filters'
const STORAGE_KEY_INIT = 'hasInitialised'

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY_TASKS)
  if (!raw) return []
  const parsed = safeJsonParse(raw, [])
  return Array.isArray(parsed) ? parsed : []
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks))
}

function ensureSeeded() {
  const raw = localStorage.getItem(STORAGE_KEY_TASKS)
  const existing = raw ? safeJsonParse(raw, null) : null
  const hasTasks = Array.isArray(existing) && existing.length > 0
  const hasFlag = localStorage.getItem(STORAGE_KEY_INIT) === 'true'

  if (hasTasks) {
    if (!hasFlag) localStorage.setItem(STORAGE_KEY_INIT, 'true')
    return
  }

  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(initialTasks))
  localStorage.setItem(STORAGE_KEY_INIT, 'true')
}

export function useTasks({ subjectIds = [] } = {}) {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY_FILTERS)
    const parsed = raw ? safeJsonParse(raw, null) : null
    if (parsed && typeof parsed === 'object') return parsed
    return Object.fromEntries(subjectIds.map((id) => [id, true]))
  })

  useEffect(() => {
    ensureSeeded()
    setTasks(loadTasks())
  }, [])

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(filters))
  }, [filters])

  const tasksByDate = useMemo(() => {
    const map = new Map()
    for (const task of tasks) {
      const key = task.date
      const arr = map.get(key) ?? []
      arr.push(task)
      map.set(key, arr)
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => {
        if (!!a.isExam !== !!b.isExam) return a.isExam ? -1 : 1
        if (!!a.done !== !!b.done) return a.done ? 1 : -1
        return String(a.name).localeCompare(String(b.name))
      })
      map.set(k, arr)
    }
    return map
  }, [tasks])

  const addTask = useCallback((task) => {
    setTasks((prev) => [...prev, task])
  }, [])

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleDone = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }, [])

  const moveTask = useCallback((id, newDate) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, date: newDate } : t)))
  }, [])

  const toggleFilter = useCallback((subjectId) => {
    setFilters((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }))
  }, [])

  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.subject === 'personal') return true
      if (filters[t.subject] === undefined) return true
      return !!filters[t.subject]
    })
  }, [tasks, filters])

  const getTasksForDay = useCallback(
    (dateObj) => {
      const key = dateObj.toISOString().slice(0, 10)
      return tasksByDate.get(key) ?? []
    },
    [tasksByDate],
  )

  const getVisibleTasksForDateString = useCallback(
    (dateStr) => {
      const all = tasksByDate.get(dateStr) ?? []
      return all.filter((t) => {
        if (t.subject === 'personal') return true
        if (filters[t.subject] === undefined) return true
        return !!filters[t.subject]
      })
    },
    [tasksByDate, filters],
  )

  const todaysTasks = useMemo(() => {
    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    return (tasksByDate.get(today) ?? []).filter((t) => !t.isHoliday)
  }, [tasksByDate])

  const isDayAllDone = useCallback(
    (dateStr) => {
      const day = tasksByDate.get(dateStr) ?? []
      const visible = day.filter((t) => !t.isHoliday)
      if (visible.length === 0) return false
      return visible.every((t) => t.done || t.isExam || t.isHoliday || t.isPersonal)
    },
    [tasksByDate],
  )

  const getHoursTotal = useCallback(
    (dateStr, { onlyVisible = false, onlyUndone = false } = {}) => {
      const day = (onlyVisible ? getVisibleTasksForDateString(dateStr) : tasksByDate.get(dateStr)) ?? []
      return day.reduce((sum, t) => {
        if (t.isHoliday || t.isExam || t.isPersonal) return sum
        if (onlyUndone && t.done) return sum
        return sum + (Number(t.hours) || 0)
      }, 0)
    },
    [tasksByDate, getVisibleTasksForDateString],
  )

  const getSubjectProgress = useCallback(
    (subjectId) => {
      const all = tasks.filter((t) => t.subject === subjectId && !t.isHoliday && !t.isExam)
      const done = all.filter((t) => t.done)
      const plannedHours = all.reduce((s, t) => s + (Number(t.hours) || 0), 0)
      const doneHours = done.reduce((s, t) => s + (Number(t.hours) || 0), 0)
      const pct = all.length === 0 ? 0 : Math.round((done.length / all.length) * 100)
      return {
        totalTasks: all.length,
        doneTasks: done.length,
        pct,
        plannedHours,
        doneHours,
      }
    },
    [tasks],
  )

  const findByDate = useCallback(
    (dateStr) => {
      const date = parseISO(dateStr)
      return tasks.filter((t) => isSameDay(parseISO(t.date), date))
    },
    [tasks],
  )

  return {
    tasks,
    visibleTasks,
    tasksByDate,
    filters,
    setFilters,
    toggleFilter,
    todaysTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleDone,
    moveTask,
    getTasksForDay,
    getVisibleTasksForDateString,
    isDayAllDone,
    getHoursTotal,
    getSubjectProgress,
    findByDate,
  }
}

