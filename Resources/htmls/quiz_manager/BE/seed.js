// seed.js — generates dummy data for quiz manager
const { v4: uuidv4 } = require('uuid');

// USERS
const users = [
  { id: 'admin1', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `user${i + 1}`,
    email: `user${i + 1}@test.com`,
    password: 'user123',
    role: 'user'
  }))
];

// QUIZZES
const quizzes = [
  {
    id: uuidv4(),
    title: 'Welcome Quiz',
    description: 'A sample quiz available to all users',
    questions: [
      { id: 'q1', label: "What's your name?", type: 'input', options: [] },
      { id: 'q2', label: 'Your gender?', type: 'radio', options: ['Male', 'Female', 'Other'] },
      { id: 'q3', label: 'Technologies you like', type: 'checkbox', options: ['JavaScript', 'Python', 'Go'] },
      { id: 'q4', label: 'Country', type: 'dropdown', options: ['Armenia', 'USA', 'Germany'] }
    ],
    createdBy: 'admin1',
    assignedUsers: 'all',
    status: 'active'
  },
  ...Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    title: `Quiz ${i + 1}`,
    description: `Description for quiz ${i + 1}`,
    questions: [
      { id: 'q0', label: 'Question input', type: 'input', options: [] },
      { id: 'q1', label: 'Pick one', type: 'radio', options: ['A', 'B', 'C'] },
      { id: 'q2', label: 'Choose all that apply', type: 'checkbox', options: ['X', 'Y', 'Z'] },
      { id: 'q3', label: 'Select from dropdown', type: 'dropdown', options: ['Opt1', 'Opt2', 'Opt3'] }
    ],
    createdBy: 'admin1',
    assignedUsers: i % 2 === 0 ? 'all' : [users[i + 1].email],
    status: i % 3 === 0 ? 'archived' : i % 2 === 0 ? 'active' : 'draft'
  }))
];

// SUBMISSIONS
const submissions = quizzes.filter(q => q.status === 'active').flatMap((quiz, idx) => (
  users.filter(u => u.role === 'user' && (quiz.assignedUsers === 'all' || quiz.assignedUsers.includes(u.email))).map(u => ({
    id: uuidv4(),
    quizId: quiz.id,
    userId: u.id,
    answers: quiz.questions.reduce((acc, q) => {
      acc[q.id] = q.type === 'checkbox' ? [q.options[0]] : q.options[0] || 'Sample Answer';
      return acc;
    }, {}),
    createdAt: new Date(Date.now() - Math.random() * 100000000).toISOString()
  }))
));

module.exports = {
  users,
  quizzes,
  submissions
};
