export class UserManagementPage {
    // Login as Admin label
    static loginAsAdminLabel() {
        return cy.get('section h2').eq(0);
    }

    // Admin Email label
    static adminEmailLabel() {
        return cy.get('label[for="admin-email"]');
    }

    // Admin Email input
    static adminEmailInput() {
        return cy.get('#admin-email');
    }

    // Admin Password label
    static adminPasswordLabel() {
        return cy.get('label[for="admin-password"]');
    }

    // Admin Password input
    static adminPasswordInput() {
        return cy.get('#admin-password');
    }

    // Login button
    static loginButton() {
        return cy.get('#admin-login-form .btn-primary');
    }

    // Logout button
    static logoutButton() {
        return cy.get('#logout-btn');
    }

    // Login status
    static loginStatus() {
        return cy.get('#login-status');
    }
    static addNewUserLabel() {
        return cy.get('#form-title');
    }

    // Full Name label
    static fullNameLabel() {
        return cy.get('label[for="name"]');
    }

    // Full Name input
    static fullNameInput() {
        return cy.get('#name');
    }

    // Role label
    static roleLabel() {
        return cy.get('label[for="role"]');
    }

    // Role input
    static roleInput() {
        return cy.get('#role');
    }

    // Age label
    static ageLabel() {
        return cy.get('label[for="age"]');
    }

    // Age input
    static ageInput() {
        return cy.get('#age');
    }

    // Email label
    static emailLabel() {
        return cy.get('label[for="email"]');
    }

    // Email input
    static emailInput() {
        return cy.get('#email');
    }

    // Gender label
    static genderLabel() {
        return cy.get('#Gender');
    }

    // Gender  radio button
    static genderRadio = (gender: string) =>
        cy.get(`input[name="gender"][value="${gender}"]`);

    // Subscribe to label
    static subscribeToLabel() {
        return cy.get('#Subscribe');
    }

    //Subscribe to checkbox component
    static subscribeComponent(){
        return cy.get('input[name="subscribe"]')
    }

    // Subscribe to  checkbox
    static subscribeCheckbox = (subs: any) =>
        cy.get(`input[name="subscribe"][value="${subs}"]`);

    // Save button
    static saveButton() {
        return cy.get('#user-form .btn-primary');
    }

    static userTableLabel() {
        return cy.get('section h2').eq(1);
    }

    // Error Message
    static adminDeleteErrorMessage() {
        return cy.get('#admin-delete-error');
    }

    //Form-Errors
    static formErrorsMessage() {
        return cy.get('#form-errors')
    }

    // User Table
    static userTable() {
        return cy.get('#user-table');
    }

    // Table Header Cells
    static tableHeaderCell(index: any) {
        return cy.get('#user-table thead th').eq(index);
    }

    // Table Body Rows
    static tableRow(index: any) {
        return cy.get('#user-table tbody tr').eq(index);
    }

    static tableData(index: any) {
        return cy.get('td').eq(index)
    }

    // Delete, Edit, and Deactivate/Activate buttons
    static editButton() {
        return cy.get('.btn-secondary.edit-btn');
    }

    static deleteButton() {
        return cy.get('.btn-danger.delete-btn');
    }

    static statusButton() {
        return cy.get('.btn-primary.status-btn');
    }

    // Modal for Delete Confirmation
    static confirmModal() {
        return cy.get('#confirm-modal');
    }

    static modalContent() {
        return cy.get('#confirm-modal .modal-content');
    }

    static modalMessage() {
        return cy.get('#confirm-modal .modal-content p');
    }

    static confirmDeleteButton() {
        return cy.get('#confirm-delete');
    }

    static cancelDeleteButton() {
        return cy.get('#cancel-delete');
    }

}
