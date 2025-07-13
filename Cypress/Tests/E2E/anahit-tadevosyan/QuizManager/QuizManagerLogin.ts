import {QuizManagerLoginPage} from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";
import {QuizManagerEndpoints} from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";

describe('Login Test Cases', () => {
    const baseUrl = '/login.html';
    beforeEach(() => {
        cy.intercept({method: 'Get', url: QuizManagerEndpoints.me()})
        cy.visit(baseUrl)
    })
    it('Login Test Cases', () => {
        QuizManagerLoginPage.emailInput().type('admin@example.com');
        QuizManagerLoginPage.passwordInput().type('admin123');
        QuizManagerLoginPage.loginButton().click();
    })
})