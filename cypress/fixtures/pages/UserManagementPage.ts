export class UserManagementPage {
   static adminEmailInput = () => cy.get("#admin-email")

   static adminPasswordInput = () => cy.get("#admin-password")

   static adminLoginButton = () => cy.get("#admin-login-form button[type=submit]")

   static nameInput = () => cy.get('#name');

   static roleSelect = () => cy.get('#role');

   static ageInput = () => cy.get('#age');

   static emailInput = () => cy.get('#email');

   static genderMale = () => cy.get('input[name="gender"][value="Male"]');

   static genderFemale = () => cy.get('input[name="gender"][value="Female"]');

   static genderOther = () => cy.get('input[name="gender"][value="Other"]');

   static subscribeNewsletter = () => cy.get('input[name="subscribe"][value="Newsletter"]');

   static subscribeProductUpdates = () => cy.get('input[name="subscribe"][value="Product Updates"]');

   static submitUserFormButton = () => cy.get('#user-form button[type="submit"]');

   static formErrors = () => cy.get('#form-errors');

   static labelName = () => cy.get('label[for="name"]');

   static labelRole = () => cy.get('label[for="role"]');

   static labelAge = () => cy.get('label[for="age"]');

   static labelEmail = () => cy.get('label[for="email"]');

   static userTableLastRow = () => cy.get('#user-table tbody tr').last();

   static adminControlsSection = () => cy.get('#admin-controls');

   static loginStatusMessage = () => cy.get('#login-status');

   static logoutButton = () => cy.get('#logout-btn');

   static userTableRows = () => cy.get('#user-table tbody tr');

   static firstUserRow = () => this.userTableRows().first();

   static firstUserStatusCell = () => this.firstUserRow().find('td').eq(6);

   static firstUserDeleteButton = () => this.firstUserRow().find('.btn-danger.delete-btn');

   static firstUserStatusButton = () => this.firstUserRow().find('.btn-primary.status-btn');

   static deleteConfirmationModal = () => cy.get('.modal-content');

   static confirmDeleteButton = () => cy.get('#confirm-delete');

}