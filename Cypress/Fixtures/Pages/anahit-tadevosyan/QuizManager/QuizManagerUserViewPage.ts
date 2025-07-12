export class QuizManagerUserViewPage {
    // Header
    static pageTitle = () => cy.get('header h1');

    static logoutButton = () => cy.get('#logout-btn');

    // Available Quizzes Section
    static availableQuizzesSection = () => cy.get('#available-quizzes');

    static availableQuizzesTitle = () => cy.get('#available-quizzes h2');

    static availableQuizList = () => cy.get('#quiz-list');

    // My Submissions Section
    static mySubmissionsSection = () => cy.get('#my-submissions');

    static mySubmissionsTitle = () => cy.get('#my-submissions h2');

    static submissionList = () => cy.get('#submission-list');
}
