export class UserPage {
  static quizzesSection = () => cy.get("#available-quizzes");
  static quizzesSectionTitle = () => cy.get("#available-quizzes h2");
  static quizzeList = () => cy.get("#quiz-list");
  static quizzListItem = (dataID: number) => cy.get(`li[data-id="${dataID}"]`);
  static quizzListItemStrong = (dataID: number) => UserPage.quizzListItem(dataID).find("strong");
  static quizzListItemButton = (dataID: number) => UserPage.quizzListItem(dataID).find("button");
}
