export class QuizzManagerAdminViewPage {
  static header = () => cy.get("header h1");

  static managerUsername = () => cy.get("#manager-username");

  static logoutButton = () => cy.get("#logout-btn");

  static createNewQuizzSection = () => cy.get("#quiz-creator")

  static quizForm = () => cy.get("#quiz-form");

  static quizTitleInput = () => cy.get("#quiz-title");

  static quizDescriptionTextarea = () => cy.get("#quiz-description");

  static addQuestionButton = () => cy.get("#add-question-btn");

  static questionText = (index:number) => cy.get("#question-list").eq(index).find(".q-label");

  static questionListItem = (index: number) => cy.get("#question-list .question-item").eq(index);

  static questionSelect = (index: number) => QuizzManagerAdminViewPage.questionListItem(index).find(".q-type");

  static questionOptions = (index: number) => QuizzManagerAdminViewPage.questionListItem(index).find(".option-input");

  static addOptionButton =(index:number) => QuizzManagerAdminViewPage.questionOptions(index).find(".add-option")

  static questionList = () => cy.get("#question-list");

  static assignModeSelect = ()=> cy.get("#assign-mode");

  static userCheckboxesContainer = () => cy.get("#user-checkboxes");

  static userCheckboxesUser = (index: number) => cy.get('#user-checkboxes label').eq(index)

  static saveQuizButton = () => cy.get('#quiz-form button[type="submit"]');

  static quizListSection = () => cy.get("#quiz-list");

  static managerQuizList = () => cy.get("#manager-quiz-list");

  static quizStatus = (index: number) =>  cy.get('li .status-badge').eq(index);

  static quizActions = (index: number) =>  cy.get('.quiz-actions').eq(index);

  static quizActionsPublishButton = (index: number) => cy.get('.publish-btn').eq(index);

  static quizActionsArchiveButton = (index:number) => cy.get('.archive-btn').eq(index);

  static quizActionsDeleteButton = (index:number) => cy.get('.delete-btn').eq(index);

  static quizTitle = (index: number) =>  cy.get('li .quiz-title').eq(index);




  static publishButton = (index: number) => cy.get("#adnin-quiz-list li").eq(index).find('.publish-btn')
  static archiveButton = (index: number) => cy.get("#adnin-quiz-list li").eq(index).find('.archive-btn')
  static deleteButton = (index: number) => cy.get("#adnin-quiz-list li").eq(index).find('.delete-btn')
  static quizListLink =() => cy.get("a .view-submissions")
  static quizzesList =() => cy.get("#admin-quiz-list")
}
