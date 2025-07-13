import {before} from "mocha";
import {QuizManagerEndpoints} from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";

describe('QuizManager Admin View', () => {
    const baseUrl = '/admin.html';
    beforeEach(() => {
        cy.intercept({method: 'Get', url: QuizManagerEndpoints.me()}).as("getCurrentUser");
        cy.intercept({method: 'Get', url: QuizManagerEndpoints.quizzes()}).as('getQuizzies');
        cy.intercept({method: 'Get', url: QuizManagerEndpoints.users()}).as('getUsers');

        cy.visit(baseUrl)

        cy.wait("@getCurrentUser").then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.wait("@getQuizzies").then((interception ) => {
            expect(interception.response.statusCode).to.eq(200);
        })
        cy.wait("@getUsers").then((interception ) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    })

    describe('Add Questions', () => {

    })
    describe('View Quizzes', () => {

    })
})