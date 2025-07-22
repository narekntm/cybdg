export class QuizManagerSubmissionsPage {
  static pageTitle = () => cy.get("header h1");

  static logoutButton = () => cy.get("header #logout-btn");

  static quizInfoSection = () => cy.get("#quiz-info");

  static quizInfoTitle = () => cy.get(".quiz-header h2");

  static quizInfoDesc = () => cy.get(".quiz-header p");

  static submissionListSection = () => cy.get("main #submission-list");
}
