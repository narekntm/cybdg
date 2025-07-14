export class AdminPage {

    static logoutButton = () => cy.get('#logout-btn');

    static quizTitleInput = () => cy.get('#quiz-title');

    static quizDescriptionInput = () => cy.get('#quiz-description');

    static addQuestionButton = () => cy.get('#add-question-btn');

    static questionTextInputs = () => cy.get('#question-list input[placeholder="Question text"]');

    static questionTypeSelects = () => cy.get('#question-list select.q-type');

    static commaSeparatedInputs = () => cy.get('#question-list input.q-opt');

    static removeQuestionButtons = () => cy.get('#question-list button.remove-question');

    static selectAssignMode = () => cy.get('#assign-mode');

    static saveQuizButton = () => cy.get('#quiz-creator button[type="submit"]');

    static userCheckboxes = () => cy.get('#user-checkboxes input[type="checkbox"]');

    static userCheckboxByEmail = (email: string) =>
        cy.get(`#user-checkboxes input[type="checkbox"][value="${email}"]`);

    static publishButton = () =>
        cy.get('#admin-quiz-list .publish-btn').first();

    static archiveButton = () =>
        cy.get('#admin-quiz-list .archive-btn').first();

    static deleteButton = () =>
        cy.get('#admin-quiz-list .delete-btn').first();

    static allViewSubmissionsLinks = () =>
    cy.get('#admin-quiz-list a.view-submissions');

    static firstViewSubmissionsLink = () =>
    cy.get('#admin-quiz-list a.view-submissions').first();

    static viewSubmissionsByQuizId = (quizId: string) =>
    cy.get(`#admin-quiz-list a.view-submissions[href*="${quizId}"]`);

}
