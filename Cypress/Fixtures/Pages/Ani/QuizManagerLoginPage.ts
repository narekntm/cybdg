export class QuizManagerLoginPage {
  static loginContainer = () => cy.get('.login-container');

  static loginContainerTitle = () => cy.get('.login-container h1');

  static emailLabel = () => cy.get('#login-form label').contains('Email');

  static passwordLabel = () => cy.get('#login-form label').contains('Password');

  static emailInput = () => cy.get('#email');

  static toastError = () => cy.get('.toast.error');

  static passwordInput = () => cy.get('#password');

  static loginBtn = () => cy.get("#login-form button[type='submit']");

  static errorMessage = () => cy.get('#error-message');

  static assignToLabel = () => cy.get('#quiz-form label:contains("Assign To:")');

  static assignModeSelect = () => cy.get('#assign-mode');

  static assignModeUserCheckbox = () => cy.get('#user-checkboxes');

  static saveQuizBtn = () => cy.get('#quiz-form button[type="submit"]');

  static quizListSection = () => cy.get('#quiz-list');

  static quizListTitle = () => cy.get('#quiz-list h2');

  static adminQuizList = () => cy.get('#admin-quiz-list');

  static firstQuizItem = () => cy.get('#admin-quiz-list > li').first();

  static firstQuizTitle = () => cy.get('#admin-quiz-list > li').first().find('.quiz-title');

  static firstQuizStatus = () => cy.get('#admin-quiz-list > li').first().find('.status-badge.active');

  static publishButton = () => cy.get('#admin-quiz-list > li').first().find('.quiz-actions .publish-btn');

  static archiveButton = () => cy.get('#admin-quiz-list > li').first().find('.quiz-actions .archive-btn');

  static deleteButton = () => cy.get('#admin-quiz-list > li').first().find('.quiz-actions .delete-btn');

  static viewSubmissionsLink = () => cy.get('#admin-quiz-list > li').first().find('.quiz-actions .view-submissions');
}