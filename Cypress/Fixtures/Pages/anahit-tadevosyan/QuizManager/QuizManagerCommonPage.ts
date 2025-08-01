export class QuizManagerCommonPage {
  static toastContainer = () => cy.get("#toast-container");

  static logoutButton = () => cy.get("#logout-btn");

  static submitBtn = () => cy.get("#submit-btn");
}
