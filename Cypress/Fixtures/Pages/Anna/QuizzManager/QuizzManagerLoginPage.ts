export class QuizzManagerLoginPage {
  static QuizManagerTitle = () => cy.get("h1")
  static QuizManagerEmailInput = () => cy.get(" #email")
  static QuizManagerPasswordInput =() => cy.get("#password")
  static QuizManagerLoginButton =() => cy.get('button[type="submit"]')
  static AdminDashboardButton =() => cy.get("#logout-btn")
  static QuizManagerSubmitError =() => cy.get("#error-message")
}

