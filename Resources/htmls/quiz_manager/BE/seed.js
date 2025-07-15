// seed.js — generates dummy data for quiz manager
const { v4: uuidv4 } = require('uuid');

// Utility: generate N options with prefix
const generateOptions = (prefix, count) =>
  Array.from({ length: count }, (_, i) => `${prefix} ${i + 1}`);

// USERS
const users = [
  { id: 'manager1', email: 'manager@quizz.com', password: 'manager123', role: 'manager' },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `user${i + 1}`,
    email: `user${i + 1}@quizz.com`,
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
      {
        id: 'q2',
        label: 'Your gender?',
        type: 'radio',
        options: generateOptions('Gender Option', Math.floor(Math.random() * 13) + 3)
      },
      {
        id: 'q3',
        label: 'Technologies you like',
        type: 'checkbox',
        options: generateOptions('Tech', Math.floor(Math.random() * 13) + 3)
      },
      {
        id: 'q4',
        label: 'Country',
        type: 'dropdown',
        options: generateOptions('Country', Math.floor(Math.random() * 13) + 3)
      }
    ],
    createdBy: 'manager1',
    assignedUsers: ['all'],
    status: 'active'
  },
  ...Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    title: `Quiz ${i + 1}`,
    description: `Description for quiz ${i + 1}`,
    questions: [
      { id: 'q0', label: 'Question input', type: 'input', options: [] },
      {
        id: 'q1',
        label: 'Pick one',
        type: 'radio',
        options: generateOptions('Choice', Math.floor(Math.random() * 13) + 3)
      },
      {
        id: 'q2',
        label: 'Choose all that apply',
        type: 'checkbox',
        options: generateOptions('Item', Math.floor(Math.random() * 13) + 3)
      },
      {
        id: 'q3',
        label: 'Select from dropdown',
        type: 'dropdown',
        options: generateOptions('Option', Math.floor(Math.random() * 13) + 3)
      }
    ],
    createdBy: 'manager1',
    assignedUsers: i % 2 === 0 ? ['all'] : [users[i + 1].email],
    status: i % 3 === 0 ? 'archived' : i % 2 === 0 ? 'active' : 'draft'
  }))
];

// SUBMISSIONS
const submissions = quizzes.filter(q => q.status === 'active').flatMap((quiz, idx) => (
  users.filter(u => u.role === 'user' && (quiz.assignedUsers[0] === 'all' || quiz.assignedUsers.includes(u.email))).map(u => ({
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
