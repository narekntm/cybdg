export class AdminPage {

    static logoutButton = () => cy.get('#logout-btn');

    static quizTitleInput = () => cy.get('#quiz-title');

    static quizDescriptionInput = () => cy.get('#quiz-description');

    static addQuestionButton = () => cy.get('#add-question-btn');

    static questionTextInput = () => cy.get('#question-list input[type="text"]');

    static questionTypeSelect = () => cy.get('#question-list ');

}
