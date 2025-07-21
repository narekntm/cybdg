export class QuizManagerSubmissionView {
  // Header
  static pageTitle = () => cy.get("header h1");

  static logoutButton = () => cy.get("#logout-btn");

  // Main Sections
  static quizInfoSection = () => cy.get("#quiz-info");

  static submissionListSection = () => cy.get("#submission-list");

  // Template Elements (for testing logic that uses templates)
  static submissionTemplate = () => cy.get("#quiz-submission-template");

  static viewSubmissions = (quizId: string) => cy.get(`.view-submissions[href="view-submissions.html?quiz=${quizId}"]`);

  static toggleSubmission = (submissionId: string) => cy.get(`.submission-toggle[data-id="${submissionId}"]`);

  static answerByQuestionLabel = (questionLabel: string) => cy.get(`dt:contains("${questionLabel}") + dd`);

  static viewSubmissionsLink = () => cy.get(".view-submissions-btn");
}
