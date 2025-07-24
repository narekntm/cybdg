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
  static questionOptionRemove = (index1: number, index2: number) =>
    QuizzManagerPage.questionOptionListItems(index1).find(".remove-option").eq(index2);

  static questionOptions = (index: number) => QuizzManagerPage.questionListItem(index).find(".option-input");
  static addOptionInputBtn = (index: number) => QuizzManagerPage.questionListItem(index).find(".add-option");

  static questionRemoveBtn = (index: number) => QuizzManagerPage.questionListItem(index).find(".remove-question");

  static userCheckboxes = () => cy.get(".user-checkboxes");
  static quizzListSection = () => cy.get("#quiz-list");
  static quizzListTitle = () => cy.get("#quiz-list #quiz-list-header");
  static quizzListCount = () => cy.get("#quiz-list #quiz-count");
  static quizzList = () => cy.get("#manager-quiz-list");
  static quizzListItems = () => cy.get("#manager-quiz-list li");
  static quizzListItem = (dataID: string) => cy.get(`#manager-quiz-list li[data-id="${dataID}"]`);

  static quizzTitle = (dataID: string) => QuizzManagerPage.quizzListItem(dataID).find(".quiz-title");
  static statusBadgeSpan = (dataID: string) => QuizzManagerPage.quizzTitle(dataID).find(".status-badge");
  static quizzDesc = (dataID: string) => QuizzManagerPage.quizzListItem(dataID).find(".quiz-description");

  static quizzActions = (dataID: string) => QuizzManagerPage.quizzListItem(dataID).find(".quizz-actions");
  static quizzPublishBtn = (dataID: string) => cy.get(`.publish-btn[data-id="${dataID}"]`);
  static quizzArchiveBtn = (dataID: string) => cy.get(`.archive-btn[data-id="${dataID}"]`);
  static quizzDeleteBtn = (dataID: string) => cy.get(`.delete-btn[data-id="${dataID}"]`);

  static quizzInfo = () => cy.get(".quiz-info");
  static quizzInfoTitle = () => cy.get(".quiz-header h2");
  static quizzDescription = () => cy.get(".quiz-header p");

  static viewSubmission = (dataID: string) => QuizzManagerPage.quizzListItem(dataID).find(".view-submissions");

  static logoutBtn = () => cy.get("#logout-btn");
}
