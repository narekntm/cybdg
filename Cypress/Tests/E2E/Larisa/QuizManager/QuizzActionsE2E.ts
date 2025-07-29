import { QuizzManagementBuilders } from "Builders/Larisa/QuizManager/QuizzManagementBuilders";
import { addQuizz, adminLogin, baseURL, createUsers, login, userLogin } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizManager/QuizzManagementEndPoints";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizManager/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizManager/QuizzManagementModels";
import { CommonPage } from "Pages/Larisa/QuizManager/CommonPage";
import { QuizzManagerPage } from "Pages/Larisa/QuizManager/QuizzManagerPage";
import { UserPage } from "Pages/Larisa/QuizManager/UserPage";

describe("Quizz Action Suite", () => {
  let quizzDataID: string;

  before(() => {
    QuizzManagementBuilders.auth().then(createUsers);
  });

  beforeEach(() => {
    cy.visit(baseURL);
    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.quizzes }).as("postQuizz");

    login(adminLogin);
    addQuizz(QuizzManagementGenerators.quizz);
    QuizzManagerPage.saveQuizzBtn().click();
  });

  it("Publish Quizz", () => {
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.quizzAction("*", QuizzManagementModels.QuizzActions.Publish) }).as(
      "publishQuizz"
    );

    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzPublishBtn(quizzDataID).click();
      cy.wait("@publishQuizz").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");
      });
      QuizzManagerPage.statusBadgeSpan(quizzDataID).invoke("text").should("eq", "active");
      QuizzManagerPage.quizzPublishBtn(quizzDataID).should("not.exist");
    });
  });

  it("Validate User access to assigned Quizz", () => {
    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzPublishBtn(quizzDataID).click();
      CommonPage.logoutBtn().click();
      login(userLogin);
      UserPage.quizzListItem(quizzDataID).should("be.visible");
    });
  });

  it("Archive Quizz", () => {
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.quizzAction("*", QuizzManagementModels.QuizzActions.Archive) }).as(
      "archiveQuizz"
    );

    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzArchiveBtn(quizzDataID).click();
      cy.wait("@archiveQuizz").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");
      });
      QuizzManagerPage.statusBadgeSpan(quizzDataID).invoke("text").should("eq", "archived");
      QuizzManagerPage.quizzArchiveBtn(quizzDataID).should("not.exist");
      QuizzManagerPage.quizzPublishBtn(quizzDataID).should("be.visible");
    });
  });

  it("Validate User restricted access to archived Quizz", () => {
    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzArchiveBtn(quizzDataID).click();
      CommonPage.logoutBtn().click();
      login(userLogin);
      UserPage.quizzListItem(quizzDataID).should("not.exist");
    });
  });

  it("Delete Quizz", () => {
    cy.intercept({ method: "DELETE", url: QuizzManagementEndPoints.deleteQuizz("*") }).as("deleteQuizz");

    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzDeleteBtn(quizzDataID).click();
      cy.wait("@deleteQuizz").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");
      });
      QuizzManagerPage.quizzListItem(quizzDataID).should("not.exist");
    });
  });

  it("Validate User restricted access to deleted Quizz", () => {
    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzDeleteBtn(quizzDataID).click();
      CommonPage.logoutBtn().click();
      login(userLogin);
      UserPage.quizzListItem(quizzDataID).should("not.exist");
    });
  });
});
