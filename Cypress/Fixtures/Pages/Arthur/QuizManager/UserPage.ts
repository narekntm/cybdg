export class UserViewPage {
  static pageTitle = () => cy.get("h1");

  static usernameLabel = () => cy.get("#username");

  static logoutButton = () => cy.get("#logout-btn");

  static availableQuizzesSection = () => cy.get("#available-quizzes");

  static availableQuizzesHeader = () => cy.get("#available-quizzes h2");

  static availableQuizCount = () => cy.get("#quiz-count");

  static availableQuizList = () => cy.get("#quiz-list");

  static availableQuizItemById = (quizId: string) => cy.get(`#quiz-list li[data-id="${quizId}"]`);

  static availableQuizTitleById = (quizId: string) => UserViewPage.availableQuizItemById(quizId).find("strong");

  static openQuizButtonById = (quizId: string) => UserViewPage.availableQuizItemById(quizId).find("button");

  static submittedQuizzesSection = () => cy.get("#my-submissions");

  static submittedQuizzesHeader = () => cy.get("#my-submissions h2");

  static submittedQuizCount = () => cy.get("#submission-count");

  static submittedQuizList = () => cy.get("#submission-list");

  static submittedQuizItemById = (submissionId: string) => cy.get(`#submission-list li[data-id="${submissionId}"]`);

  static submittedQuizTitleById = (submissionId: string) => UserViewPage.submittedQuizItemById(submissionId).find("strong");

  static submittedQuizDateById = (submissionId: string) => UserViewPage.submittedQuizItemById(submissionId).invoke("text");

  static editSubmissionButtonById = (submissionId: string) => UserViewPage.submittedQuizItemById(submissionId).find("button");

  static availableQuizTitleByText = (title: string) => cy.get("#quiz-list li").contains("strong", title);

  static availableQuizItemByTitle = (title: string) => UserViewPage.availableQuizTitleByText(title).parents("li");

  static openQuizButtonByTitle = (title: string) => UserViewPage.availableQuizItemByTitle(title).find("button");

  static toastError = () => cy.get(".toast.error");
}
