export class QuizzManagerCreateNewPage {
  static pageTitle = () => cy.get("h1")
  static adminDashboardTitle = () => cy.get("#quiz-creator h2");
  static quizTitleInput = () => cy.get("#quiz-title");
  static quizDescriptionTextarea = () => cy.get("#quiz-description");
  static addQuestionButton =() => cy.get ("#add-question-btn")

  static questionTextInput =() => cy.get(".q-label")
  static selectInput =() => cy.get(".q-type")
  static commaSeperatedOptionsInput =() => cy.get(".q-options")
  static removeQuestionButton =() => cy.get(".remove-question")

  static assignToText = () => cy.get("#add-question-btn ~ label")
  static assignToAllUsersInput = () => cy.get("#assign-mode").select("All Users")
  static assignToSelectedUsersInput = () => cy.get("#assign-mode").select("Selected Users")
  static checkboxUser1 = () => cy.get("input[value='user1@example.com']")
  static checkboxUser2 = () => cy.get("input[value='user2@example.com']")
  static labelCheckboxUser1 = () => cy.get("#user-checkboxes").find("label").eq(0)
  static labelCheckboxUser2 = () => cy.get("#user-checkboxes").find("label").eq(1)
  static saveQuizButton = () => cy.get("button[type='submit']")

  static myQuizzesTitle =() => cy.get("#quiz-list h2")
  static quizTitle1 = () => cy.get(".quiz-title").eq(0).contains("text","Welcome Quiz")
  static quizTitle2 = () => cy.get(".quiz-title").eq(1).contains("text","test 1 title")
  static statusActive = () => cy.get("span .active")
  static statusArchived = () => cy.get("span .archived")
  static statusDraft = () => cy.get("span .draft")

  static publishButton = (index: number) => cy.get("#adnin-quiz-list li").eq(index).find('.publish-btn')
  static archiveButton = (index: number) => cy.get("#adnin-quiz-list li").eq(index).find('.archive-btn')
  static deleteButton = (index: number) => cy.get("#adnin-quiz-list li").eq(index).find('.delete-btn')
  static quizListLink =() => cy.get("a .view-submissions")
  static quizzesList =() => cy.get("#admin-quiz-list")
}
