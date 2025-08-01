export class QuizManagerManagerViewPage {
  static quizTitleInput = () => cy.get("#quiz-title");

  static quizDescriptionTextarea = () => cy.get("#quiz-description");

  static addQuestionButton = () => cy.get("#add-question-btn");

  static questionTitleInput = (quId: string) => cy.get(`input[data-qid="${quId}"]`);

  static questionType = (quId: string) => cy.get(`input[data-qid="${quId}"]`).siblings(".q-type");

  static questionOption = (quId: string) => cy.get(`input[data-qid="${quId}"]`).parent().find(".option-input");

  static assignedUsersByEmail = (userEmail: string) => cy.get(`.user-checkbox input[value="${userEmail}"]`);

  static assignModeSelect = () => cy.get("#assign-mode");

  static saveQuizButton = () => cy.get('#quiz-form button[type="submit"]');

  static quizListSection = () => cy.get("#quiz-list");

  static publishByQuizId = (quId: string) => cy.get(`#manager-quiz-list li[data-id="${quId}"] .quiz-actions .publish-btn`);

  static archiveByQuizId = (quId: string) => cy.get(`#manager-quiz-list li[data-id="${quId}"] .quiz-actions .archive-btn `);

  static deleteByQuizId = (quId: string) => cy.get(`#manager-quiz-list li[data-id="${quId}"] .quiz-actions .delete-btn`);

  static titleByQuizId = (quId: string) => cy.get(`#manager-quiz-list li[data-id="${quId}"] .quiz-title`);

  static descriptionByQuizId = (quId: string) => cy.get(`#manager-quiz-list li[data-id="${quId}"] .quiz-description`);

  static quizListHeader = () => cy.get("#quiz-list-header");

  static statusByQuizId = (quId: string) => cy.get(`#manager-quiz-list li[data-id="${quId}"] .status-badge`);

  static quizToggle = () => cy.get(".quiz-toggle");
}
