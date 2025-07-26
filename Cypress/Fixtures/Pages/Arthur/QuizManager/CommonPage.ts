export class CommonPage {
  static logoutButton = () => cy.get("#logout-btn");

  static toastPopup = () => cy.get(".toast");

  static toastSuccess = () => cy.get(".toast.success");

  static toastError = () => cy.get(".toast.error");

  static pageTitle = () => cy.get("h1");

  static headerByText = (text: string) => cy.get("h1").contains(text);

  static toastContainer = () => cy.get("#toast-container");

  static username = () => cy.get("#username");

  static managerUsername = () => cy.get("#manager-username");
}
