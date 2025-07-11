// Updated: server.js
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const PORT = 3000

// Middleware
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(bodyParser.json())

// In-memory stores
const users = [
  { id: 'admin1', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: 'user1', email: 'user1@example.com', password: 'user123', role: 'user' },
  { id: 'user2', email: 'user2@example.com', password: 'user123', role: 'user' },
]
const quizzes = []
const submissions = []
const sessions = {}

quizzes.push({
  id: uuidv4(),
  title: 'Welcome Quiz',
  description: 'A sample quiz available to all users',
  questions: [
    { id: 'q1', label: 'What\'s your name?', type: 'input', options: [] },
    { id: 'q2', label: 'Your gender?', type: 'radio', options: ['Male', 'Female', 'Other'] },
    { id: 'q3', label: 'Technologies you like', type: 'checkbox', options: ['JavaScript', 'Python', 'Go'] },
    { id: 'q4', label: 'Country', type: 'dropdown', options: ['Armenia', 'USA', 'Germany'] },
  ],
  createdBy: 'admin1',
  assignedUsers: 'all',
  status: 'active',
})
quizzes.push({
  'id': uuidv4(),
  'title': 'test 1 title',
  'description': 'test 1 desc',
  'questions': [
    {
      'id': 'q0',
      'label': 'quaestion 1',
      'type': 'input',
      'options': []
    },
    {
      'id': 'q1',
      'label': 'question radio 2',
      'type': 'radio',
      'options': [
        'a',
        'b',
        'c'
      ]
    },
    {
      'id': 'q2',
      'label': 'question checkbox 3',
      'type': 'checkbox',
      'options': [
        'c',
        'd',
        'e'
      ]
    },
    {
      'id': 'q3',
      'label': 'question dropdown 4',
      'type': 'dropdown',
      'options': [
        'f',
        'g',
        'h'
      ]
    }
  ],
  'assignedUsers': 'all',
  'status': 'draft',
  'createdBy': 'admin1'
})

function authenticate (req, res, next) {
  const token = req.cookies.authToken
  if (token && sessions[token]) {
    req.user = sessions[token]
    return next()
  }
  res.status(401).json({ error: 'Unauthorized' })
}

function isAdmin (req, res, next) {
  if (req.user.role === 'admin') return next()
  res.status(403).json({ error: 'Forbidden' })
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const sessionId = uuidv4()
  sessions[sessionId] = user
  res.cookie('authToken', sessionId, {
    httpOnly: false,
    sameSite: 'None',
    secure: true,     // ⚠️ Must be HTTPS or browser will block it
    path: '/',
    crossSite: true,
  })
  res.json({ success: true })
})

app.post('/api/logout', authenticate, (req, res) => {
  delete sessions[req.cookies.authToken]
  res.clearCookie('authToken', { path: '/' })
  res.json({ success: true })
})

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json(req.user)
})

app.get('/api/users', authenticate, isAdmin, (req, res) => {
  const nonAdmins = users.filter(u => u.role !== 'admin').map(u => ({
    id: u.id,
    email: u.email,
    role: u.role
  }))
  res.json(nonAdmins)
})

app.post('/api/quizzes', authenticate, isAdmin, (req, res) => {
  const { title, description, questions, assignedUsers } = req.body
  const quiz = {
    id: uuidv4(),
    title,
    description,
    questions,
    assignedUsers: assignedUsers || 'all',
    status: 'draft',
    createdBy: req.user.id,
  }
  quizzes.push(quiz)
  res.json(quiz)
})

app.patch('/api/quizzes/:id/publish', authenticate, isAdmin, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  quiz.status = 'active'
  res.json({ success: true })
})

app.patch('/api/quizzes/:id/archive', authenticate, isAdmin, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  quiz.status = 'archived'
  res.json({ success: true })
})

app.delete('/api/quizzes/:id', authenticate, isAdmin, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  const hasSubs = submissions.some(s => s.quizId === quiz.id)
  if (hasSubs) return res.status(400).json({ error: 'Quiz has submissions' })
  quizzes.splice(quizzes.indexOf(quiz), 1)
  res.json({ success: true })
})

app.get('/api/quizzes', authenticate, (req, res) => {
  const user = req.user
  if (user.role === 'admin') {
    return res.json(quizzes.filter(q => q.createdBy === user.id))
  }
  const visible = quizzes.filter(q => q.status === 'active' && (q.assignedUsers === 'all' || (Array.isArray(q.assignedUsers) && q.assignedUsers.includes(user.email))))
  res.json(visible)
})

app.get('/api/quizzes/:id', authenticate, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Not found' })
  res.json(quiz)
})

app.post('/api/quizzes/:id/submissions', authenticate, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })

  const existing = submissions.find(s => s.quizId === quiz.id && s.userId === req.user.id)
  if (existing) return res.status(409).json({ error: 'Already submitted' })

  const submission = {
    id: uuidv4(),
    quizId: quiz.id,
    userId: req.user.id,
    answers: req.body.answers,
    createdAt: new Date().toISOString(),
  }
  submissions.push(submission)
  res.json(submission)
})

app.put('/api/submissions/:id', authenticate, (req, res) => {
  const sub = submissions.find(s => s.id === req.params.id)
  if (!sub || sub.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
  const quiz = quizzes.find(q => q.id === sub.quizId)
  if (quiz.status !== 'active') return res.status(400).json({ error: 'Quiz is not editable' })
  sub.answers = req.body.answers
  res.json({ success: true })
})

app.get('/api/submissions/me', authenticate, (req, res) => {
  res.json(submissions.filter(s => s.userId === req.user.id))
})

app.get('/api/quizzes/:id/submissions', authenticate, isAdmin, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  res.json(submissions.filter(s => s.quizId === quiz.id))
})

app.get('/api/submissions/:id', authenticate, (req, res) => {
  const sub = submissions.find(s => s.id === req.params.id)
  if (!sub) return res.status(404).json({ error: 'Submission not found' })
  if (req.user.role !== 'admin' && sub.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
  res.json(sub)
})

app.listen(PORT, () => console.log(`Quiz backend running at http://localhost:${PORT}`))

export default app
