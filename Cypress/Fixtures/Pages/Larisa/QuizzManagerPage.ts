export class QuizzManagerPage {
  static toggleHeader = () => cy.get("#quiz-creator h2");
  static quizzTitleLbl = () => cy.get('label[for="quiz-title"]');
  static quizzTitleInput = () => cy.get("#quiz-title");
  static quizzDescLbl = () => cy.get('label[for="quiz-description"]');
  static quizzDescTextArea = () => cy.get("#quiz-description");
  static addQuestionBtn = () => cy.get("#add-question-btn");
  static assignToLbl = () => cy.get('label[for="assign-mode"]');
  static assignModeSelect = () => cy.get("#assign-mode");
  static assignModeOptions = () => cy.get("#assign-mode option");

  static userCheckBoxes = () => cy.get("#user-checkboxes");
  static userCheckBoxesItems = () => cy.get('#user-checkboxes input[type="checkbox"]');

  static saveQuizzBtn = () => cy.get('button[type="submit"]');

  static questionList = () => cy.get("#question-list");
  static questionListItems = () => cy.get("#question-list .question-item");
  static questionListItem = (index: number) => cy.get("#question-list .question-item").eq(index);

  static questionIndex = (index: number) => QuizzManagerPage.questionListItem(index).find(".question-index");
  static questionText = (index: number) => QuizzManagerPage.questionListItem(index).find(".q-label");
  static questionSelect = (index: number) => QuizzManagerPage.questionListItem(index).find(".q-type");
  static questionSelectOptions = (index: number) => QuizzManagerPage.questionListItem(index).find(".q-type option");

  static questionOptionList = (index: number) => QuizzManagerPage.questionListItem(index).find(".q-options-container .q-options-list");
  static questionOptionListItems = (index: number) => QuizzManagerPage.questionOptionList(index).find(".q-option-item");
  static questionOptionSpan = (index1: number, index2: number) => QuizzManagerPage.questionOptionListItems(index1).find("span").eq(index2);

  static questionOptions = (index: number) => QuizzManagerPage.questionListItem(index).find(".option-input");
  static addOptionInputBtn = (index: number) => QuizzManagerPage.questionListItem(index).find(".add-option");

  static questionRemoveBtn = (index: number) => QuizzManagerPage.questionListItem(index).find(".remove-question");

  static userCheckboxes = () => cy.get(".user-checkboxes");
  static quizzListSection = () => cy.get("#quiz-list");
  static quizzListTitle = () => cy.get("#quiz-list h2");
  static quizzList = () => cy.get("#manager-quiz-list");
  static quizzListItems = () => cy.get("#manager-quiz-list li");

  static quizzListItem = (dataID: number) => cy.get(`.quiz-item[data-id="${dataID}"]`);

  static quizzTitle = (dataID: number) => QuizzManagerPage.quizzListItem(dataID).find(".quiz-title");
  static statusBadgeSpan = (dataID: number) => QuizzManagerPage.quizzTitle(dataID).find(".status-badge");

  static quizzActions = (dataID: number) => QuizzManagerPage.quizzListItem(dataID).find(".quizz-actions");
  static quizzPublishBtn = (dataID: number) => cy.get(`.publish-btn[data-id="${dataID}"]`);
  static quizzArchiveBtn = (dataID: number) => cy.get(`.archive-btn[data-id="${dataID}"]`);
  static quizzDeleteBtn = (dataID: number) => cy.get(`.delete-btn[data-id="${dataID}"]`);

  static quizzInfo = (dataID: number) => QuizzManagerPage.quizzListItem(dataID).find(".quiz-info");
  static quizzDescription = (dataID: number) => QuizzManagerPage.quizzInfo(dataID).find(".quiz-description");
  static quizzAssignees = (dataID: number) => QuizzManagerPage.quizzInfo(dataID).find(".quiz-assignees");

  static viewSubmission = (dataID: number) => QuizzManagerPage.quizzListItem(dataID).find(".view-submissions");

  static logoutBtn = () => cy.get("#logout-btn");
}
