export class QuizManagerAdminViewPage {
    static logoutButton = () => cy.get('#logout-btn');

    static headerTitle = () => cy.get('header h1');

    static quizForm = () => cy.get('#quiz-form');

    static quizTitleInput = () => cy.get('#quiz-title');

    static quizDescriptionTextarea = () => cy.get('#quiz-description');

    static addQuestionButton = () => cy.get('#add-question-btn');

    static questionList = () => cy.get('#question-list');

    static assignModeSelect = () => cy.get('#assign-mode');

    static userCheckboxesContainer = () => cy.get('#user-checkboxes');

    static saveQuizButton = () => cy.get('#quiz-form button[type="submit"]');

    static quizListSection = () => cy.get('#quiz-list');

    static adminQuizList = () => cy.get('#admin-quiz-list');
}
