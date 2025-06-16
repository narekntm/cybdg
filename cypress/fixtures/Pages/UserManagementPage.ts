export class UserManagementPage {
    static adminEmailInput = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[id="admin-email"]')

    static adminPasswordInput = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[id="admin-password"]')

    static adminLoginBtn = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('form[id="admin-login-form"] button[type="submit"]')

    static adminLogoutBtn = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#logout-btn')

    static adminLoginStatusMsg = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#login-status')

    static adminControlsPanel = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#admin-controls')

    static adminEmailLabel = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="admin-email"]')

    static adminPasswordLabel = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="admin-password"]')

    static userFullNameInput = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[id="name"]')

    static userRoleDropdown = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('select[id="role"]')

    static userAgeInput = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[id="age"]')

    static userEmailInput = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[id="email"]')

    static userGenderFemaleBtn = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[value="Female"]')

    static userSaveBtn = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('form[id="user-form"] button[type="submit"]')

    static userTableData = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#user-table tbody tr') 

    static userValidationErrors = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#form-errors ul li')

    static userFormTitle = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#form-title')

    static userNameLabel = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="name"]')

    static userRoleLabel = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="role"]')

    static userAgeLabel = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="age"]')

    static userEmailLabel = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="email"]')

    static userGenderLabel = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[value="Male"]').parents('label').parent().siblings('label')

    static userGenderMaleBtn = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[value="Male"]')

    static userDeleteValidationError = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#admin-delete-error')

    static userDeleteConfirmationModal = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('.modal-content')

    static userDeleteConfirmBtn = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#confirm-delete')

    static userDeleteCancelBtn = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#cancel-delete')

    static userSubscriptionLabel = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[value="Newsletter"]').parents('label').parent().siblings('label')
}








