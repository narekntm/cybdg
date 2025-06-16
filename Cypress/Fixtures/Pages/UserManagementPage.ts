export class UserManagementPage {

    static adminEmailInput = () => cy.get("#admin-email");

    static adminPasswordInput = () => cy.get("#admin-password");

    static loginButton = () => cy.get('button[type="submit"].btn-primary').contains("Login");

    static userNameInput = () => cy.get("#name");

    static userRoleSelect = () => cy.get("#role");

    static userAgeInput = () => cy.get("#age");

    static userEmailInput = () => cy.get("#email");

    static userGenderRadio = (gender: string) =>
        cy.get(`input[name="gender"][value="${gender}"]`);

    static userSubscriptionCheckbox = (subscription: string) =>
        cy.get(`input[name="subscribe"][value="${subscription}"]`);

    static saveButton = () => cy.get('button[type="submit"].btn-primary').contains("Save");

    static adminControls = () => cy.get("#admin-controls");

    static logoutButton = () => cy.get("#logout-btn");

    static loginStatus = () => cy.get("#login-status");

    static userRow = (username: string) => cy.contains("#user-table tr", username);

    static deleteButtonInRow = (username: string) => this.userRow(username).find("button.delete-btn");

    static confirmModal = () => cy.get("#confirm-modal");

    static deleteError = () => cy.get("#admin-delete-error");

    static formTitle = () => cy.get("#form-title");

    static formErrors = () => cy.get("#form-errors");

    static editButtonInRow = (username: string) =>
        this.userRow(username).find("button.edit-btn");

    static cancelDeleteButton = () => cy.get("#cancel-delete");

    static confirmDeleteButton = () => cy.get("#confirm-delete");

    static statusCellInRow = (username: string) =>
        this.userRow(username).find("td").eq(6);

    static activateButtonInRow = (username: string) =>
        this.userRow(username).contains("Activate");

    static deactivateButtonInRow = (username: string) =>
        this.userRow(username).contains("Deactivate");

}


