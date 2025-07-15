export class QuizManagerUserViewPage {

  static welcomeHeader = () => cy.get("header h1").contains("Welcome, User");

  static logoutButton = () => cy.get("#logout-btn");

  static availableQuizzesSection = () => cy.get("#available-quizzes");

  static availableQuizzesTitle = () => cy.get("#available-quizzes h2");

  static availableQuizList = () => cy.get("#quiz-list");

  static mySubmissionsSection = () => cy.get("#my-submissions");

  static mySubmissionsTitle = () => cy.get("#my-submissions h2");

  static submissionList = () => cy.get("#submission-list");

  static quizForm = () => cy.get("#quiz-form");

  static quizTitleInput = () => cy.get("#quiz-title");

  static quizDescriptionInput = () => cy.get("#quiz-description");

  static addQuestionButton = () => cy.get("#add-question-btn");

  static assignModeSelect = () => cy.get("#assign-mode");

  static userCheckboxContainer = () => cy.get("#user-checkboxes");

  static questionList = () => cy.get("#question-list");

  static questionItems = () => cy.get(".question-item");

  static questionLabelInput = (index: number) => cy.get(".question-item").eq(index).find(".q-label");

  static questionTypeSelect = (index: number) => cy.get(".question-item").eq(index).find(".q-type");

  static questionOptionsInput = (index: number) => cy.get(".question-item").eq(index).find(".q-options");

  static removeQuestionButton = (index: number) => cy.get(".question-item").eq(index).find(".remove-question");

  static quizList = () => cy.get("#admin-quiz-list");

  static quizListItems = () => cy.get("#admin-quiz-list li");

  static quizTitleInList = (index: number) => cy.get("#admin-quiz-list li").eq(index).find(".quiz-title");

  static statusBadge = (index: number) => cy.get("#admin-quiz-list li").eq(index).find(".status-badge");

  static publishButton = (index: number) => cy.get("#admin-quiz-list li").eq(index).find(".publish-btn");

  static archiveButton = (index: number) => cy.get("#admin-quiz-list li").eq(index).find(".archive-btn");

  static deleteButton = (index: number) => cy.get("#admin-quiz-list li").eq(index).find(".delete-btn");
}