export class CommonPage {
  static toast = () => cy.get(".toast");
  static logoutBtn = () => cy.get("#logout-btn");
}
