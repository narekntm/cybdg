export class QuizManagerAdminDashboardPage {
  static headerTitle = () => cy.get("header h1");

  static toastContainer = () => cy.get(".toast-container");

  static quizTitle = () => cy.get("#manager-quiz-list .quiz-title");

  static createNewQuizBtn = () => cy.get(".toggle-header");

  static quizTitleInput = () => cy.get("input#quiz-title");

  static quizDescriptionInput = () => cy.get("textarea#quiz-description");

  static addQuestionBtn = () => cy.get("#add-question-btn");

  static questionTextInput = () => cy.get(".q-label");

  static questionTypeInput = () => cy.get(".q-type");

  static assignToDropdown = () => cy.get("select#assign-mode");

  static saveQuizBtn = () => cy.get('button[type="submit"]');
}
