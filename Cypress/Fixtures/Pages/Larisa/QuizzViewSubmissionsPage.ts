export class QuizzViewSubmissionsPage {
  static quizzTitle = () => cy.get(".quiz-header h2");
  static quizzDesc = () => cy.get(".quiz-header p");
  static submissionList = () => cy.get("#submission-list");
  static submissionListItems = () => cy.get("#submission-list li");
  static submissionListItem = (dataID: string) => cy.get(`#submission-list li[data-id="${dataID}"]`);
  static submissionListInfo = () => cy.get("#submission-list p");
  static submissionItem = (dataID: string) => cy.get(`.submission[data-id="${dataID}"]`);
  static answers = (dataID: string) => QuizzViewSubmissionsPage.submissionItem(dataID).find("dl");
  static questionTitle = (dataID: string, index: number) => QuizzViewSubmissionsPage.answers(dataID).find("dt").eq(index);
  static questionAnswer = (dataID: string, index: number) => QuizzViewSubmissionsPage.answers(dataID).find("dd").eq(index);

  static submissionCard = (dataID: string) => cy.get(`.submission-card[data-id="${dataID}"]`);
  static submissionCardName = (dataID: string) => QuizzViewSubmissionsPage.submissionCard(dataID).find("h3 span");
  static submissionCardUser = (dataID: string) => QuizzViewSubmissionsPage.submissionCard(dataID).find("span");
  static submissionCardCreated = (dataID: string) => QuizzViewSubmissionsPage.submissionCard(dataID).find(".submission-timestamp");
}
