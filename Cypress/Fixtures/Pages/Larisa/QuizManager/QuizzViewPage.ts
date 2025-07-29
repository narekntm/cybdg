export class QuizzViewPage {
  static quizzTitle = () => cy.get("#quiz-title");
  static quizzDesc = () => cy.get("#quiz-description");
  static question = (index: number) => cy.get(".question").eq(index);
  static questionHeader = (index: number) => QuizzViewPage.question(index).find(".question-header");
  static questionInput = (index: number) => QuizzViewPage.question(index).find("input");
  static questionOptionList = (index: number) => QuizzViewPage.question(index).find("input");
  static questionOptionSelect = (index: number) => QuizzViewPage.question(index).find("select");
  static questionOptionSelectOptions = (index: number) => QuizzViewPage.questionOptionSelect(index).find("option");
  static submitBtn = () => cy.get("#submit-btn");
}
