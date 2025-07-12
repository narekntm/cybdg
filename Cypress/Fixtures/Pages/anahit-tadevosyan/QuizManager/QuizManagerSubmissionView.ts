export class QuizSubmissionsPage {
    // Header
    static pageTitle = () => cy.get('header h1');

    static logoutButton = () => cy.get('#logout-btn');

    // Main Sections
    static quizInfoSection = () => cy.get('#quiz-info');

    static submissionListSection = () => cy.get('#submission-list');

    // Template Elements (for testing logic that uses templates)
    static submissionTemplate = () => cy.get('#quiz-submission-template');

    static viewSubmissionsLink = () => cy.get('.view-submissions-btn');
}
