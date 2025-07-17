export class QuizzViewSubmissionsPage {
  static quizzTitle = () => cy.get(".quiz-header h2");
  static quizzDesc = () => cy.get(".quiz-header p");
  static submissionList = () => cy.get("#submission-list");
  static submissionListInfo = () => cy.get("#submission-list p");
  static submissionItem = (dataID: number) => cy.get(`.submission[data-id="${dataID}"]`);
  static answers = (dataID: number) => QuizzViewSubmissionsPage.submissionItem(dataID).find("dl");
}
