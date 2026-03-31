export const subjects = [
  {
    id: 'algorithms',
    name: 'Algorithms & Data Structures',
    chip: 'Algorithms',
    color: 'alg',
    examDate: '2026-04-30',
  },
  {
    id: 'physics',
    name: 'Physics — Fields & Matter',
    chip: 'Physics',
    color: 'phys',
    examDate: '2026-05-01',
  },
  {
    id: 'fds',
    name: 'Foundation to Data Science',
    chip: 'FDS',
    color: 'fds',
    examDate: '2026-05-06',
  },
  {
    id: 'maths',
    name: 'Mathematics — Dynamics & VC',
    chip: 'Mathematics',
    color: 'maths',
    examDate: '2026-05-12',
  },
]

export function subjectById(id) {
  return subjects.find((s) => s.id === id) ?? null
}

export const subjectColorClasses = {
  algorithms: {
    chip: 'chip-alg',
    border: 'border-alg',
    tint: 'bg-blue-50',
  },
  physics: {
    chip: 'chip-phys',
    border: 'border-phys',
    tint: 'bg-emerald-50',
  },
  fds: {
    chip: 'chip-fds',
    border: 'border-fds',
    tint: 'bg-fuchsia-50',
  },
  maths: {
    chip: 'chip-maths',
    border: 'border-maths',
    tint: 'bg-orange-50',
  },
  personal: {
    chip: 'chip-personal',
    border: 'border-personal',
    tint: 'bg-pink-50',
  },
}

export function classesForSubject(subjectId) {
  return subjectColorClasses[subjectId] ?? subjectColorClasses.personal
}

