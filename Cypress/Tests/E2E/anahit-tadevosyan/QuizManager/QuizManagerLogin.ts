import {QuizManagerLoginPage} from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";

describe('Login Test Cases', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/login.html')
    })
    it('Login Test Cases', () => {
        QuizManagerLoginPage.emailInput().type('admin@example.com');
        QuizManagerLoginPage.passwordInput().type('admin123');
        QuizManagerLoginPage.loginButton().click();
    })
})