export class QuizManagerLoginPage {
    static emailInput = () => cy.get('#email');

    static passwordInput = () => cy.get('#password');

    static loginButton = () => cy.get('button[type="submit"]');

    static loginForm = () => cy.get('#login-form');

    static errorMessage = () => cy.get('#error-message');

    static loginContainer = () => cy.get('.login-container');

    static emailLabel = () => cy.get('label').contains('Email');

    static passwordLabel = () => cy.get('label').contains('Password');
}
