import { LoginPage} from "Pages/David Pages/QuizManagerPages/QuizManagerLoginPage";
import {QuizManagerLoginModels} from "Models/David Models/QuizManagerModels/QuizManagerLoginModels";
import {QuizManagerMethods} from "../../../../Fixtures/Methods/David Methods/QuizManagerMethods/QuizManagerLoginMethods";
import { QuizManagerGenerator } from "Generators/David Generators/QuizManagerGenerators/QuizManagerLoginGenerator";
import { AdminPage } from "Pages/David Pages/QuizManagerPages/QuizManagerAdminPage";

describe("LoginTests", () => {

  context("Negative Cases", () => {
    beforeEach(() => {
      cy.visit("http://127.0.0.1:8000/login.html")
    })
    it('Should check login with invalid credentials', () => {
      QuizManagerMethods.Auth(QuizManagerGenerator.invalidUser())
      LoginPage.errorsField().should('contain.text', QuizManagerLoginModels.errorMessages.invalidCreds)
    })
    it('Should check login with empty credentials', () => {
      QuizManagerMethods.Auth(QuizManagerGenerator.emptyUser())
      cy.url().should("contain", "/login.html")
    })
    it('Should check login with empty email', () => {
      QuizManagerMethods.Auth({password: QuizManagerGenerator.ValidAdmin().password})
      cy.url().should("contain", "/login.html")
    })
    it('Should check login with empty password', () => {
      QuizManagerMethods.Auth({login: QuizManagerGenerator.ValidAdmin().login})
      cy.url().should("contain", "/login.html")
    })
    it('Should check login as User with invalid password', () => {
      QuizManagerMethods.Auth({login: QuizManagerGenerator.ValidUser1().login})
      cy.url().should("contain", "/login.html")
    })
    it('Should check login as User with invalid email', () => {
      QuizManagerMethods.Auth({password: QuizManagerGenerator.ValidUser1().password})
      cy.url().should("contain", "/login.html")
    })
  })
  context.only("Positive Cases", () => {
    beforeEach(() => {
      cy.visit("http://127.0.0.1:8000/login.html")
    })
    it('Should check login with correct admin credentials', () => {
      QuizManagerMethods.Auth(QuizManagerGenerator.ValidAdmin())
      cy.url().should("contain", "/admin.html")
      AdminPage.headerText().should('contain', 'Admin Dashboard')
    })
    it('Should check login with correct User1 credentials', () => {
      QuizManagerMethods.Auth(QuizManagerGenerator.ValidUser1())
      cy.url().should("contain", "/user.html")
    })
    it('Should check login with correct User2 credentials', () => {
      QuizManagerMethods.Auth(QuizManagerGenerator.ValidUser2())
      cy.url().should("contain", "/user.html")
    })
  })
});