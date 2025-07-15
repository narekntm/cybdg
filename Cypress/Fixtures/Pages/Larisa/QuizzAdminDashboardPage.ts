export class QuizzAdminDashboardPage {
  static autIframe = () => cy.get('.aut-iframe');
  static title = () => cy.get('#quiz-creator h2');
  static quizzTitleInput = () => cy.get('#quiz-title');
  static quizzDescTextArea = () => cy.get('#quiz-description');

  static questionList = () => cy.get('#question-list');
  static questionListItems = () => cy.get('#question-list .question-item');
  static questionListItem = (index: number) => cy.get('.question-item').eq(index); 

  static questionText = (index: number) => QuizzAdminDashboardPage.questionListItem(index).find('.q-label');
  static questionSelect = (index: number) => QuizzAdminDashboardPage.questionListItem(index).find('.q-type');
  static questionOptions = (index: number) => QuizzAdminDashboardPage.questionListItem(index).find('.q-options');
  static questionRemoveBtn = (index: number) => QuizzAdminDashboardPage.questionListItem(index).find('.remove-question');

  static addQuestionBtn = () => cy.get('#add-question-btn');
  static assignToLbl = () => cy.get('#assign-mode').prev();
  static assignMode = () => cy.get('#assign-mode');
  static userCheckboxes = () => cy.get('.user-checkboxes');
  static assignModeOptions = () => cy.get('#assign-mode option');
  static saveQuizzBtn = () => cy.get('button[type="submit"]');
  static quizzListSection = () => cy.get('#quiz-list');
  static quizzListTitle = () => cy.get('#quiz-list h2');
  static quizzList = () => cy.get('#admin-quiz-list');

  static quizzTitle = (index: number) => cy.get('.quiz-title').eq(index);
  static statusBadgeSpan = (index: number) => cy.get('.status-badge').eq(index);
  static quizzPublishBtn = (index: number) => cy.get('.publish-btn').eq(index);
  static quizzArchiveBtn = (index: number) => cy.get('.archive-btn').eq(index);
  static quizzDeleteBtn = (index: number) => cy.get('.delete-btn').eq(index);
  static viewSubmission = (index: number) => cy.get('.view-submissions').eq(index);
}