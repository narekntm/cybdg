export class QuizManagerUserDashboardPage {
  static logoutButton = () => cy.get("header #logout-btn");

  static availableQuizzesSection = () => cy.get("main #available-quizzes");

  static availableQuizzesTitle = () => cy.get("main #available-quizzes h2");

  static quizList = () => cy.get("#quiz-list");

  static mySubmissionsSection = () => cy.get("main #my-submissions");

  static mySubmissionsTitle = () => cy.get("main #my-submissions h2");

  static submissionList = () => cy.get("main #my-submissions #submission-list");
}
