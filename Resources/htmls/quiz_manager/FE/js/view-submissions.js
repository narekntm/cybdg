// view-submissions.js (Enhanced UI)
import { apiGet } from './api.js'
import './logout.js'
import { showToast } from './toast'

const quizId = new URLSearchParams(window.location.search).get('quiz')
const quizInfo = document.getElementById('quiz-info')
const list = document.getElementById('submission-list')

async function init () {
  quizInfo.innerHTML = '<p>Loading quiz details...</p>'
  list.innerHTML = '<p>Loading submissions...</p>'

  if (!quizId) {
    quizInfo.innerHTML = ''
    list.innerHTML = '<p>Missing quiz ID in URL</p>'
    return
  }

  try {
    const quiz = await apiGet(`/api/quizzes/${quizId}`)
    quizInfo.innerHTML = `
      <div class="quiz-header">
        <h2>${quiz.title}</h2>
        <p>${quiz.description}</p>
      </div>`

    const submissions = await apiGet(`/api/quizzes/${quizId}/submissions`)
    if (submissions.length === 0) {
      list.innerHTML = '<p>No submissions yet.</p>'
      return
    }

    // Show total count
    const countDisplay = document.createElement('p')
    countDisplay.className = 'submission-count'
    countDisplay.innerHTML = `<strong>Total Submissions:</strong> ${submissions.length}`
    list.innerHTML = ''
    list.appendChild(countDisplay)

    submissions.forEach((sub, index) => {
      const timestamp = new Date(sub.createdAt).toLocaleString()
      const container = document.createElement('div')
      container.className = 'submission submission-card submission-toggle'

      const header = document.createElement('h3')
      header.innerHTML = `
                <span>Submission #${index + 1} </span>
                <span><strong>User:</strong> ${sub.userId}</span>
                <span class="submission-timestamp"><strong>Created At:</strong> ${timestamp}</span>`
      
      container.appendChild(header)

      const dl = document.createElement('dl')
      dl.classList.add('answers')
      dl.style.maxHeight = '0'
      dl.style.overflow = 'hidden'
      dl.style.transition = 'max-height 0.3s ease'

      Object.entries(sub.answers).forEach(([qid, answer]) => {
        const label = quiz.questions.find(q => q.id === qid)?.label || qid
        const dt = document.createElement('dt')
        dt.textContent = label
        const dd = document.createElement('dd')
        dd.textContent = Array.isArray(answer) ? answer.join(', ') : answer
        dl.appendChild(dt)
        dl.appendChild(dd)
      })

      container.addEventListener('click', () => {
        const isOpen = dl.classList.contains('open')
        if (isOpen) {
          dl.style.maxHeight = '0'
        } else {
          dl.style.maxHeight = dl.scrollHeight + 'px'
        }
        dl.classList.toggle('open', !isOpen)
        container.classList.toggle('open', !isOpen)
      })

      container.appendChild(dl)
      list.appendChild(container)
    })
  } catch (err) {
    showToast("Error loading submissions: " + err.message,"error");
    console.error('Error loading submissions:', err)
    quizInfo.innerHTML = ''
    list.innerHTML = `<p class=\"error\">Error: ${err.message}</p>`
  }
}

// Add global expand/collapse toggle
const toggleBtn = document.createElement('button')
toggleBtn.textContent = 'Expand All'
toggleBtn.className = 'toggle-submissions'

toggleBtn.addEventListener('click', () => {
  const allDl = document.querySelectorAll('.submission dl')
  const isCollapsed = Array.from(allDl).every(dl => !dl.classList.contains('open'))

  allDl.forEach(dl => {
    if (isCollapsed) {
      dl.style.maxHeight = dl.scrollHeight + 'px'
      dl.classList.add('open')
    } else {
      dl.style.maxHeight = '0'
      dl.classList.remove('open')
    }
  })

  document.querySelectorAll('.submission').forEach(sub => {
    sub.classList.toggle('open', isCollapsed)
  })

  toggleBtn.textContent = isCollapsed ? 'Collapse All' : 'Expand All'
})

list.prepend(toggleBtn)
init()
