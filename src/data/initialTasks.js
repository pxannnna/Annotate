import { v4 as uuidv4 } from 'uuid'

const alg = 'algorithms'
const phys = 'physics'
const fds = 'fds'
const maths = 'maths'
const personal = 'personal'

function t(subject, date, name, hours, type, extra = {}) {
  return {
    id: uuidv4(),
    subject,
    name,
    date,
    hours,
    type,
    notes: '',
    done: false,
    ...extra,
  }
}

export const initialTasks = [
  // Algorithms & Data Structures (exam Apr 30)
  t(alg, '2026-04-01', 'Watch lectures 1–5', 5, 'Lecture'),
  t(alg, '2026-04-02', 'Watch lectures 6–10', 5, 'Lecture'),
  t(alg, '2026-04-03', 'Watch lectures 11–15 + Quiz 1', 6, 'Lecture'),
  t(alg, '2026-04-04', 'Watch lectures 16–18', 3, 'Lecture'),
  t(alg, '2026-04-05', 'Watch lectures 19–23', 5, 'Lecture'),
  t(alg, '2026-04-06', 'Watch lectures 24–28 + Quiz 2', 6, 'Lecture'),
  t(alg, '2026-04-07', 'Watch lectures 29–35 + Quiz 3', 7, 'Lecture'),
  t(alg, '2026-04-08', 'Tutorials 1–3', 6, 'Tutorial'),
  t(alg, '2026-04-09', 'Tutorials 4–6 + Quiz 4', 7, 'Tutorial'),
  t(alg, '2026-04-10', 'Tutorials 7–9', 6, 'Tutorial'),
  t(alg, '2026-04-11', 'Tutorial 10 + skim labs', 5, 'Tutorial'),
  t(alg, '2026-04-16', 'Notes + past papers start', 8, 'Past Paper'),
  t(alg, '2026-04-17', 'Past papers continued', 8, 'Past Paper'),
  t(alg, '2026-04-18', 'Past papers + notes review', 8, 'Past Paper'),
  t(alg, '2026-04-19', 'Full review + weak topics', 8, 'Review'),
  t(alg, '2026-04-20', 'Final past paper + revision', 8, 'Past Paper'),
  t(alg, '2026-04-21', 'Last review', 6, 'Review'),
  t(alg, '2026-04-22', 'Light review only', 3, 'Review'),
  t(alg, '2026-04-30', 'EXAM — Algorithms', 0, 'Exam', { isExam: true }),

  // Physics — Fields & Matter (exam May 1)
  t(phys, '2026-04-04', 'Fields lectures 1–3', 3, 'Lecture'),
  t(phys, '2026-04-07', 'Fields lectures 4–8', 5, 'Lecture'),
  t(phys, '2026-04-08', 'Fields lectures 9–12', 4, 'Lecture'),
  t(phys, '2026-04-09', 'Fields lectures 13–16', 4, 'Lecture'),
  t(phys, '2026-04-10', 'Fields workshops 1–3', 4, 'Workshop'),
  t(phys, '2026-04-11', 'Fields quizzes all', 3, 'Quiz'),
  t(phys, '2026-04-14', 'Matter lectures 1–5', 3, 'Lecture'),
  t(phys, '2026-04-17', 'Matter lectures 6–11', 6, 'Lecture'),
  t(phys, '2026-04-19', 'Matter lectures 12–17', 6, 'Lecture'),
  t(phys, '2026-04-20', 'Matter workshops 1–4', 6, 'Workshop'),
  t(phys, '2026-04-23', 'Matter workshops 5–7 + quizzes all', 6, 'Workshop'),
  t(phys, '2026-04-24', 'Physics full notes', 6, 'Notes'),
  t(phys, '2026-04-25', 'Past paper practice', 6, 'Past Paper'),
  t(phys, '2026-04-26', 'Past papers continued', 7, 'Past Paper'),
  t(phys, '2026-04-27', 'Full subject review', 7, 'Review'),
  t(phys, '2026-04-28', 'Final review', 6, 'Review'),
  t(phys, '2026-04-29', 'Rest + light notes', 3, 'Rest'),
  t(phys, '2026-04-30', 'Light Physics review', 4, 'Review', { isPostExam: true }),
  t(phys, '2026-05-01', 'EXAM — Physics', 0, 'Exam', { isExam: true }),

  // Foundation to Data Science (exam May 6)
  t(fds, '2026-04-21', 'FDS lectures 1–6', 4, 'Lecture'),
  t(fds, '2026-04-22', 'FDS lectures 7–12', 5, 'Lecture'),
  t(fds, '2026-04-23', 'FDS lectures 13–19', 6, 'Lecture'),
  t(fds, '2026-04-24', 'FDS lectures 20–25', 2, 'Lecture'),
  t(fds, '2026-04-24', 'FDS workshops 1–4', 2, 'Workshop'),
  t(fds, '2026-04-25', 'FDS lectures 26–31 + workshops 5–7', 7, 'Lecture'),
  t(fds, '2026-04-26', 'FDS labs skim + notes', 6, 'Labs'),
  t(fds, '2026-04-27', 'FDS past papers start', 6, 'Past Paper'),
  t(fds, '2026-04-28', 'FDS past papers', 6, 'Past Paper'),
  t(fds, '2026-04-29', 'FDS final review', 4, 'Review'),
  t(fds, '2026-05-01', 'FDS light review', 3, 'Review'),
  t(fds, '2026-05-02', 'FDS full day review', 7, 'Review'),
  t(fds, '2026-05-03', 'FDS past papers', 6, 'Past Paper'),
  t(fds, '2026-05-04', 'FDS final crunch', 6, 'Review'),
  t(fds, '2026-05-05', 'Final light review', 4, 'Review'),
  t(fds, '2026-05-06', 'EXAM — FDS', 0, 'Exam', { isExam: true }),

  // Mathematics — Dynamics & VC (exam May 12)
  t(maths, '2026-04-01', 'Dynamics lectures 1–4', 8, 'Lecture'),
  t(maths, '2026-04-02', 'Dynamics lectures 5–8', 8, 'Lecture'),
  t(maths, '2026-04-03', 'Dynamics workshops 1–3', 9, 'Workshop'),
  t(maths, '2026-04-05', 'Dynamics workshops 4–6', 9, 'Workshop'),
  t(maths, '2026-04-06', 'Dynamics workshops 7–10', 9, 'Workshop'),
  t(maths, '2026-04-12', 'VC lectures 1–4', 8, 'Lecture'),
  t(maths, '2026-04-13', 'VC lectures 5–8', 8, 'Lecture'),
  t(maths, '2026-04-14', 'VC lectures 9–11', 6, 'Lecture'),
  t(maths, '2026-04-15', 'VC workshops 1–3', 9, 'Workshop'),
  t(maths, '2026-04-16', 'VC workshops 4–7', 6, 'Workshop'),
  t(maths, '2026-04-18', 'VC workshops 8–10', 6, 'Workshop'),
  t(maths, '2026-05-02', 'Maths review start', 5, 'Review'),
  t(maths, '2026-05-03', 'VC + dynamics past papers', 6, 'Past Paper'),
  t(maths, '2026-05-04', 'Past papers continued', 6, 'Past Paper'),
  t(maths, '2026-05-05', 'Weak areas focus', 5, 'Review'),
  t(maths, '2026-05-06', 'Maths revision', 5, 'Review'),
  t(maths, '2026-05-07', 'Past papers full day', 8, 'Past Paper'),
  t(maths, '2026-05-08', 'VC deep revision', 7, 'Review'),
  t(maths, '2026-05-09', 'Dynamics deep revision', 7, 'Review'),
  t(maths, '2026-05-10', 'Mixed past papers', 7, 'Past Paper'),
  t(maths, '2026-05-11', 'Final review + rest', 5, 'Review'),
  t(maths, '2026-05-12', 'EXAM — Mathematics', 0, 'Exam', { isExam: true }),

  // Personal / events
  t(personal, '2026-04-04', 'Ball evening', 0, 'Personal', { isPersonal: true }),

  // Portugal trip (lighter days)
  ...[
    '2026-04-08',
    '2026-04-09',
    '2026-04-10',
    '2026-04-11',
    '2026-04-12',
    '2026-04-13',
    '2026-04-14',
    '2026-04-15',
  ].map((date) =>
    t(personal, date, 'Portugal trip', 0, 'Holiday', { isHoliday: true }),
  ),
]

