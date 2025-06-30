export class UserManagementPage {

    static adminEmailInput = () => cy.get("#admin-email");

    static openLoginModalButton = () => cy.get("#open-login-modal");

    static adminLoginModal = () => cy.get("#admin-login-modal");

    static adminPasswordInput = () => cy.get("#admin-password");

    static loginButton = () => cy.get('button.btn-primary.full-width');

    static closeLoginModalButton = () => cy.get("#close-login-modal");

    static adminStatusText = () => cy.get("#admin-status-text");

    static addNewUserButton = () => cy.get("#open-user-modal");

    static closeUserModalButton = () => cy.get("#close-user-modal");

    static searchInput = () => cy.get("#search-input");

    static userNameInput = () => cy.get("#name");

    static userRoleSelect = () => cy.get("#role");

    static userAgeInput = () => cy.get("#age");

    static userEmailInput = () => cy.get("#email");

    static userGenderRadio = (gender: string) => cy.get(`input[name="gender"][value="${gender}"]`);

    static userSubscriptionCheckbox = (subscription: string) => cy.get(`input[name="subscribe"][value="${subscription}"]`);

    static saveButton = () => cy.get('button[type="submit"].btn-primary').contains("Save");

    static adminControls = () => cy.get("#admin-controls");

    static logoutButton = () => cy.get("#logout-btn");

    static loginStatus = () => cy.get("#login-status");

    static userRow = (username: string) => cy.contains("#user-table tr", username);

    static deleteButtonInRow = (username: string) => this.userRow(username).find("button.delete-btn");

    static viewButtonInRow = (username: string) => this.userRow(username).find("a.btn-neutral");

    static confirmModal = () => cy.get("#confirm-delete-modal");

    static deleteError = () => cy.get("#admin-delete-error");

    static formTitle = () => cy.get("#form-title");

    static formErrors = () => cy.get("#form-errors");

    static editButtonInRow = (username: string) => this.userRow(username).find("button.edit-btn");

    static editButtonInRowById = (id: number) => {
        return cy.get(`#user-table tr[data-id="${id}"]`).find("button.edit-btn");
    };

    static cancelDeleteButton = () => cy.get("#cancel-delete");

    static confirmDeleteButton = () => cy.get("#confirm-delete");

    static statusCellInRow = (username: string) => this.userRow(username).find("td").eq(6);

    static activateButtonInRow = (username: string) => this.userRow(username).contains("Activate");

    static deactivateButtonInRow = (username: string) => this.userRow(username).contains("Deactivate");

    static resetButton = () => cy.get("#reset-btn");

    static confirmResetModal = () => cy.get("#confirm-reset-modal");

    static confirmResetButton = () => cy.get("#confirm-reset");

    static cancelResetButton = () => cy.get("#cancel-reset");

    static prevButton = () => cy.get("#prev-page");

    static nextButton = () => cy.get("#next-page");

    static backButton = () => cy.get("#back-btn");

    static editButton = () => cy.get("#edit-btn");

    static saveUserDataButton = () => cy.get("#save-btn");

    static cancelUserDataSaveButton = () => cy.get("#cancel-btn");

    static toastContainer = () => cy.get("#toast-container");

    static genderSelect = () => cy.get("#gender");

    static newsletterCheckbox = () => cy.get("input[value='Newsletter']");

    static productCheckbox = () => cy.get("input[value='Product Updates']");

    static userNameText = () => cy.get("#user-name");

    static userRowById = (id: number) => cy.get(`tr[data-id="${id}"]`);

    static deleteButtonInRowById = (id: number) => this.userRowById(id).find("button.delete-btn");

    static viewButtonInRowById = (id: number) => this.userRowById(id).find("a.btn-neutral");

    static userFormModal = () => cy.get("#user-form-modal");

    static statusCellInRowById = (id: number) => this.userRowById(id).find("td").eq(6);

    static statusButtonInRowById = (id: number) => this.userRowById(id).find("button.status-btn");

    static userRows = () => cy.get("#user-table tbody tr");

}
