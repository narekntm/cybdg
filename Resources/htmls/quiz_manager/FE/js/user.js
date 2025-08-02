// user.js
import { apiGet } from './api.js'
import './logout.js'
import { showToast } from './toast.js'

// DOM elements for quizzes and submissions
const quizListEl = document.getElementById('quiz-list')
const submissionListEl = document.getElementById('submission-list')

// 1) Page initialization: authenticate then load data
;(async function initUserPage () {
  try {
    const user = await apiGet('/api/auth/me') // parsed JSON
    if (user.role !== 'user') {
      return window.location.href = 'login.html'
    }
    // Add user id to header
    const usernameEl = document.getElementById('username')
    usernameEl.innerText = user.id
  } catch (err) {
    console.error('Auth failed:', err)
    return window.location.href = 'login.html'
  }
  

 
  // 2) Load quizzes and submissions after auth
  await loadAvailableQuizzes()
  await loadSubmissions()
})()

// 3) Load available quizzes for the user
async function loadAvailableQuizzes () {
  quizListEl.innerHTML = '<li>Loading quizzes...</li>'
  try {
    const quizzes = await apiGet('/api/quizzes')
    console.log('User quizzes:', quizzes)
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      quizListEl.innerHTML = '<li>No available quizzes.</li>'
      return
    }

    const quizzCount = document.getElementById('quiz-count')
    quizzCount.innerText = `(${quizzes.length})`
    quizListEl.innerHTML = ''
    // randomize quizzes array
    quizzes.sort(() => 0.5 - Math.random());
    quizzes.forEach(q => {
      const li = document.createElement('li')
      li.dataset.id = q.id;
      li.innerHTML = `
        <strong>${q.title}</strong> ${q.description}<br>
        <button onclick="window.location.href='quiz-view.html?quiz=${q.id}'">Submit</button>
      `
      quizListEl.appendChild(li)
    })
  } catch (err) {
    showToast("Failed to load quizzes: " + err.message,"error");
    console.error('Failed to load quizzes:', err)
    quizListEl.innerHTML = '<li>Error loading quizzes.</li>'
  }
}

// 4) Load user's own submissions
async function loadSubmissions () {
  submissionListEl.innerHTML = '<li>Loading submissions...</li>'
  try {
    const subs = await apiGet('/api/submissions/me')
    console.log('User submissions:', subs)
    if (!Array.isArray(subs) || subs.length === 0) {
      submissionListEl.innerHTML = '<li>No submissions found.</li>'
      return
    }
    
    const subCount = document.getElementById('submission-count')
    subCount.innerText = `(${subs.length})`

    submissionListEl.innerHTML = ''
    
    // sort submissions by createdAt
    subs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    for (const sub of subs) {
      try {
        const quiz = await apiGet(`/api/quizzes/${sub.quizId}`)
        const editable = quiz.status === 'active'
        const li = document.createElement('li')
        li.dataset.id = sub.id
        li.innerHTML = `
          <strong>${quiz.title}</strong> Created At: ${new Date(sub.createdAt).toLocaleString()}<br>
          <button onclick="window.location.href='quiz-view.html?quiz=${quiz.id}&submission=${sub.id}'">
            ${editable ? 'Edit' : 'View'} Submission
          </button>
        `
        submissionListEl.appendChild(li)
      } catch (err) {
        showToast(`Failed to fetch quiz ${sub.quizId}:` + err.message,"error");
        console.error(`Failed to fetch quiz ${sub.quizId}:`, err)
      }
    }
  } catch (err) {
    console.error('Failed to load submissions:', err)
    submissionListEl.innerHTML = '<li>Error loading submissions.</li>'
  }
}
