export class QuizManagerUserQuizPage {
  static logoutButton = () => cy.get("header #logout-btn");

  static quizTitle = () => cy.get("#quiz-container h2");

  static quizDescription = () => cy.get("main #quiz-container #quiz-description");

  static quizForm = () => cy.get("#quiz-container #quiz-form");

  static submitButton = () => cy.get("#quiz-container #submit-btn");
}
