export class QuizManagerAdminViewPage {
  static header = () => cy.get("header");

  static managerUsername = () => cy.get("#manager-username");

  static logoutButton = () => cy.get("#logout-btn");

  static quizCreatorSection = () => cy.get("#quiz-creator");

  static quizForm = () => cy.get("#quiz-form");

  static quizTitleInput = () => cy.get("#quiz-title");

  static quizDescriptionInput = () => cy.get("#quiz-description");

  static questionList = () => cy.get("#question-list");

  static addQuestionButton = () => cy.get("#add-question-btn");

  static questionTypeSelect = () => cy.get(".q-type");

  static questionTypeDropdown = (index: number) => cy.get(".q-type option").eq(index);

  static questionTypeOptionsInput = () => cy.get(".q-type option");

  static removeQuestionButton = () => cy.get(".remove-question");

  static assignModeSelect = () => cy.get("#assign-mode");

  static assignModeAllOption = () => cy.get("#assign-mode option[value='all']");

  static assignModeCustomOption = () => cy.get("#assign-mode option[value='custom']");

  static userCheckboxes = () => cy.get("#user-checkboxes");

  static userCheckboxesUser = (index: number) => cy.get("#user-checkboxes label").eq(index);

  static saveQuizButton = () => cy.get("#quiz-form button[type='submit']");

  static quizListSection = () => cy.get("#quiz-list");

  static quizList = () => cy.get("#admin-quiz-list");

  static quizStatus = (index: number) => cy.get("li .status-badge").eq(index);

  static quizActions = (index: number) => cy.get(".quiz-actions").eq(index);

  static quizActionsPublishButton = () => cy.get(".publish-btn");

  static quizActionsArchiveButton = () => cy.get(".archive-btn");

  static quizListHeader = () => cy.get("#quiz-list-header");

  static managerQuizList = () => cy.get("#manager-quiz-list");

  static quizCount = () => cy.get("#quiz-count");

  static quizActionsDeleteButton = () => cy.get(".delete-btn");

  static quizTitle = (index: number) => cy.get("li .quiz-title").eq(index);

  static toastContainer = () => cy.get("#toast-container");

  static adminQuizList = () => cy.get("#admin-quiz-list");
}
