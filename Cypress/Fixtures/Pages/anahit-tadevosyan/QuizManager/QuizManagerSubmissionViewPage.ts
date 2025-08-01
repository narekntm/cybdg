export class QuizManagerSubmissionViewPage {
  static viewSubmissions = (quizId: string) => cy.get(`.view-submissions[href="view-submissions.html?quiz=${quizId}"]`);

  static toggleSubmission = (submissionId: string) => cy.get(`.submission-toggle[data-id="${submissionId}"]`);

  static answerByQuestionLabel = (questionLabel: string) => cy.get(`dt:contains("${questionLabel}") + dd`);

  static viewSubmissionsLink = () => cy.get(".view-submissions-btn");
}
