export class QuizManagerAdminDashboardPage {
  static headerTitle = () => cy.get('header h1');

  static logoutButton = () => cy.get('header #logout-btn');

  static quizCreatorSection = () => cy.get('#quiz-creator');

  static quizCreatorTitle = () => cy.get('#quiz-creator h2');

  static quizTitleInput = () => cy.get('#quiz-form #quiz-title');

  static quizDescriptionInput = () => cy.get('#quiz-form #quiz-description');

  static addQuestionBtn = () => cy.get('#add-question-btn');

  static quizQuestionText = () => cy.get('.q-label');

  static quizQuestionTypeSelector = () => cy.get('.q-type');

  static quizOptionsInput = () => cy.get('.q-options');

  static quizQuestionRemoveBtn = () => cy.get('.remove-question');

}