export class AdminDashboardPage {
  static usernameInput = () => cy.get("#username");

  static emailInput = () => cy.get("#email");

  static roleDropdown = () => cy.get("#role");

  static subscriptionCheckbox = () => cy.get("#newsletter");

  static submitBtn = () => cy.get('[type="submit"]');

  static userTable = () => cy.get(".table.user-table");

  static userEditModal = () => cy.get("#edit-modal");

  static userEditModalCloseBtn = () => cy.get(".btn.close-modal");

  static sidebarSubSections = () => cy.get(".sidebar").get("ul > li");

  static dashboardFooter = () => cy.get(".footer");
}
