export class UserViewPage {
  static pageTitle = () => cy.get("h1").contains("Welcome, User");

  static logoutButton = () => cy.get("#logout-btn");

  static availableQuizzesSection = () => cy.get("#available-quizzes");

  static availableQuizzesTitle = () => UserViewPage.availableQuizzesSection().find("h2").contains("Available Quizzes");

  static availableQuizItems = () => cy.get("#quiz-list li");

  static availableQuizTitle = (index: number = 0) => UserViewPage.availableQuizItems().eq(index).find("strong");

  static openQuizButton = (index: number = 0) => UserViewPage.availableQuizItems().eq(index).find("button");

  static submittedQuizzesSection = () => cy.get("#my-submissions");

  static submittedQuizzesTitle = () => UserViewPage.submittedQuizzesSection().find("h2").contains("My Submitted Quizzes");

  static submittedQuizItems = () => cy.get("#submission-list li");

  static submittedQuizTitle = (index: number = 0) => UserViewPage.submittedQuizItems().eq(index).find("strong");

  static submittedQuizDate = (index: number = 0) => UserViewPage.submittedQuizItems().eq(index).invoke("text");

  static editSubmissionButton = (index: number = 0) => UserViewPage.submittedQuizItems().eq(index).find("button");

  static url = "/user.html";

  static visit(): void {
    cy.visit(this.url);
  }
}
