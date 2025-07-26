export class QuizSubmissionsPage {
  static quizTitle = () => cy.get("#quiz-info h2");

  static quizDescription = () => cy.get("#quiz-info p");

  static totalSubmissionsText = () => cy.get("#submission-list strong").contains("Total Submissions:");

  static totalSubmissionsValue = () => cy.get("#submission-list").find("p").invoke("text");

  static submissionCards = () => cy.get(".submission-card");

  static submissionCard = (index: number = 0) => QuizSubmissionsPage.submissionCards().eq(index);

  static submissionUser = (index = 0) => QuizSubmissionsPage.submissionCard(index).find("h3 span");

  static submissionTimestamp = (index: number = 0) => QuizSubmissionsPage.submissionCard(index).find(".submission-timestamp");

  static submissionDetails = (index: number = 0) => QuizSubmissionsPage.submissionCard(index).find("dl").should("be.visible");

  static submissionCardById = (id: string) => cy.get(`.submission-card[data-id="${id}"]`);

  static submissionAnswersById = (id: string) => QuizSubmissionsPage.submissionCardById(id).find(".answers");

  static errorText = () => cy.get(".error");

  static answerTerm = (label: string) => cy.get("dt").contains(label);

  static answerValue = (label: string) => QuizSubmissionsPage.answerTerm(label).next("dd");
}
