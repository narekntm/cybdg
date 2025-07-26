export class ManagerPage {
  static quizCreatorDropdown = () => cy.get("#quiz-creator");

  static quizTitleInput = () => cy.get("#quiz-title");

  static quizDescriptionInput = () => cy.get("#quiz-description");

  static addQuestionButton = () => cy.get("#add-question-btn");

  static questionTextInputs = () => cy.get('#question-list input[placeholder="Question text"]');

  static questionTypeSelects = () => cy.get("#question-list select.q-type");

  static optionInputFields = () => cy.get(".question-item .option-input");

  static addOptionButtons = () => cy.get(".question-item .add-option");

  static removeQuestionButtons = () => cy.get("#question-list button.remove-question");

  static selectAssignMode = () => cy.get("#assign-mode");

  static userCheckboxes = () => cy.get("#user-checkboxes input[type='checkbox']");

  static userCheckboxByEmail = (email: string) => cy.get(`#user-checkboxes input[type='checkbox'][value="${email}"]`);

  static saveQuizButton = () => cy.get('#quiz-form button[type="submit"]');

  static quizTitles = () => cy.get("#manager-quiz-list .quiz-title");

  static quizItemByTitle = (title: string) => cy.get(`#manager-quiz-list .quiz-title:contains("${title}")`).parents("li");

  static publishButton = () => cy.get("#manager-quiz-list .publish-btn").first();

  static archiveButton = () => cy.get("#manager-quiz-list .archive-btn").first();

  static deleteButton = () => cy.get("#manager-quiz-list .delete-btn").first();

  static allViewSubmissionsLinks = () => cy.get("#manager-quiz-list a.view-submissions");

  static firstViewSubmissionsLink = () => cy.get("#manager-quiz-list a.view-submissions").first();

  static viewSubmissionsByQuizId = (quizId: string) => cy.get(`#manager-quiz-list a.view-submissions[href*="${quizId}"]`);

  static statusBadge = () => cy.get(".status-badge");

  static statusBadgeWithinItem = () => cy.get(".status-badge");

  static getQuizIdByTitle = (title: string): Cypress.Chainable<string> => ManagerPage.quizItemByTitle(title).invoke("attr", "data-id");

  static publishButtonWithin = () => cy.get(".publish-btn");

  static archiveButtonWithin = () => cy.get(".archive-btn");

  static deleteButtonWithin = () => cy.get(".delete-btn");

  static quizItemById = (id: string) => cy.get(`#manager-quiz-list li[data-id="${id}"]`);

  static quizTitleInItem = () => cy.get(".quiz-title");

  static quizDescriptionInItem = () => cy.get(".quiz-description");
}
