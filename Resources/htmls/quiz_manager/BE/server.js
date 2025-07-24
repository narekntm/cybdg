// server.js (refactored to use seed.js)
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
let { users, quizzes, submissions } = require('./seed')

if (!process.env.SEED) {
  quizzes = [{
    id: uuidv4(),
    title: 'Welcome Quiz',
    description: 'A sample quiz available to all users',
    questions: [
      { id: 'q1', label: 'What\'s your name?', type: 'input', options: [] },
      { id: 'q2', label: 'Your gender?', type: 'radio', options: ['Male', 'Female', 'Other'] },
      { id: 'q3', label: 'Technologies you like', type: 'checkbox', options: ['JavaScript', 'Python', 'Go'] },
      { id: 'q4', label: 'Country', type: 'dropdown', options: ['Armenia', 'USA', 'Germany'] },
    ],
    createdBy: 'manager1',
    assignedUsers: ['all'],
    status: 'active',
  },
    {
      id: uuidv4(),
      title: 'test 1 title',
      description: 'test 1 desc',
      questions: [
        {
          id: 'q0',
          label: 'quaestion 1',
          type: 'input',
          options: []
        },
        {
          id: 'q1',
          label: 'question radio 2',
          type: 'radio',
          options: [
            'a',
            'b',
            'c'
          ]
        },
        {
          id: 'q2',
          label: 'question checkbox 3',
          type: 'checkbox',
          options: [
            'c',
            'd',
            'e'
          ]
        },
        {
          id: 'q3',
          label: 'question dropdown 4',
          type: 'dropdown',
          options: [
            'f',
            'g',
            'h'
          ]
        }
      ],
      assignedUsers: ['all'],
      status: 'draft',
      createdBy: 'manager1'
    }]
  // users = [
  //   { id: 'manager1', email: 'manager@quizz.com', password: 'manager123', role: 'manager' },
  //   { id: 'user1', email: 'user1@quizz.com', password: 'user123', role: 'user' },
  //   { id: 'user2', email: 'user2@quizz.com', password: 'user123', role: 'user' },
  // ]
  submissions = []
}

const app = express()
const PORT = 5252
const sessions = {}
const testSessions = {}
const TEST_CREDENTIALS = {
  email: 'testmanager@example.com',
  password: 'test123'
}

// Middleware
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(bodyParser.json())

function authenticate (req, res, next) {
  const token = req.cookies.authToken
  if (token && sessions[token]) {
    req.user = sessions[token]
    return next()
  }
  res.status(401).json({ error: 'Unauthorized' })
}

function isManager (req, res, next) {
  if (req.user.role === 'manager') return next()
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
    secure: true,
    path: '/',
    crossSite: true,
  }
)
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

app.get('/api/users', authenticate, isManager, (req, res) => {
  const nonManagers = users.filter(u => u.role !== 'manager').map(u => ({
    id: u.id,
    email: u.email,
    role: u.role
  }))
  res.json(nonManagers)
})

app.post('/api/quizzes', authenticate, isManager, (req, res) => {
  const { title, description, questions, assignedUsers } = req.body
  const quiz = {
    id: uuidv4(),
    title,
    description,
    questions,
    assignedUsers: assignedUsers || ['all'],
    status: 'draft',
    createdBy: req.user.id,
  }
  quizzes.push(quiz)
  res.json(quiz)
})

app.patch('/api/quizzes/:id/publish', authenticate, isManager, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  quiz.status = 'active'
  res.json({ success: true })
})

app.patch('/api/quizzes/:id/archive', authenticate, isManager, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  quiz.status = 'archived'
  res.json({ success: true })
})

app.delete('/api/quizzes/:id', authenticate, isManager, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  const hasSubs = submissions.some(s => s.quizId === quiz.id)
  if (hasSubs) return res.status(400).json({ error: 'Quiz has submissions' })
  quizzes.splice(quizzes.indexOf(quiz), 1)
  res.json({ success: true })
})

app.get('/api/quizzes', authenticate, (req, res) => {
  const user = req.user
  if (user.role === 'manager') {
    return res.json(quizzes.filter(q => q.createdBy === user.id))
  }
  const visible = quizzes.filter(q =>
    q.status === 'active' &&
    (q.assignedUsers[0] === 'all' ||
      (Array.isArray(q.assignedUsers) && q.assignedUsers.includes(user.email)))
  )
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

app.get('/api/quizzes/:id/submissions', authenticate, isManager, (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  res.json(submissions.filter(s => s.quizId === quiz.id))
})

app.get('/api/submissions/:id', authenticate, (req, res) => {
  const sub = submissions.find(s => s.id === req.params.id)
  if (!sub) return res.status(404).json({ error: 'Submission not found' })
  if (req.user.role !== 'manager' && sub.userId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' })
  res.json(sub)
})

// Test routs 

app.post('/api/test/auth', (req, res) => {
  const { email, password } = req.body

  if (email !== TEST_CREDENTIALS.email || password !== TEST_CREDENTIALS.password) {
    return res.status(401).json({ error: 'Invalid test credentials' })
  }

  const token = uuidv4()
  testSessions[token] = { email }

  res.json({ token })
})

app.post('/api/test/users', testAuthenticate, (req, res) => {
  const { id, email, password, role } = req.body

  if (!id || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required user fields' })
  }

  if (!['manager', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role must be either "manager" or "user"' })
  }

  const exists = users.find(u => u.id === id || u.email === email)
  if (exists) {
    return res.status(409).json({ error: 'User with this ID or email already exists' })
  }

  users.push({ id, email, password, role })
  return res.status(201).json({ message: 'User created successfully' })
})

function testAuthenticate (req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.split(' ')[1]
  if (!testSessions[token]) {
    return res.status(403).json({ error: 'Invalid or expired test token' })
  }

  req.testUser = testSessions[token]
  next()
}

app.listen(PORT, () => console.log(`Quiz backend running at http://127.0.0.1:${PORT}`))
