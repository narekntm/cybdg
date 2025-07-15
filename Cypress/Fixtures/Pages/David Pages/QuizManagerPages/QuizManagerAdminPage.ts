export class AdminPage {
  static headerText = () => cy.get("header h1");

  static logoutButton = () => cy.get("#logout-btn");

  static quizCreatorForm = () => cy.get("#quiz-creator");

  static quizTitleInput = () => cy.get("#quiz-title");

  static quizDescriptionInput = () => cy.get("#quiz-description");

  static addQuestionButton = () => cy.get("#add-question-btn");

  static questionTextInput = () => cy.get("[class='question-item'] [data-qid]");

  static questionTypeSelect = () => cy.get("[class='q-type']");

  static questionTypeDropdown = (index: number) => cy.get("[class='q-type'] option").eq(index);

  static questionTypeOptionsInput = () => cy.get("[class='q-type'] option");

  static removeQuestionButton = () => cy.get(".remove-question");

  static assignToSelect = () => cy.get("#assign-mode");

  static assignToAllUsers = () => cy.get("#assign-mode option[value='all']");

  static assignToSelectedUsers = () => cy.get('#assign-mode option[value="custom"]');

  static userCheckboxes = () => cy.get("#user-checkboxes");

  static userCheckboxesUser = (index: number) => cy.get("#user-checkboxes label").eq(index);

  static usersCheckboxes = (index: number) => cy.get("#user-checkboxes label input").eq(index);

  static saveQuizButton = () => cy.get('#assign-mode ~ button[type="submit"]');

  static quizListSection = () => cy.get("#quiz-list");

  static quizList = () => cy.get("#admin-quiz-list");

  static quizFromList = (index: number) => cy.get("#admin-quiz-list li").eq(index);

  static quizTitle = (index: number) => cy.get("li .quiz-title").eq(index);

  static quizStatus = (index: number) => cy.get("li .status-badge").eq(index);

  static quizActions = (index: number) => cy.get(".quiz-actions").eq(index);

  static quizActionsPublishButton = () => cy.get(".publish-btn");

  static quizActionsArchiveButton = () => cy.get(".archive-btn");

  static quizActionsDeleteButton = () => cy.get(".delete-btn");
}
