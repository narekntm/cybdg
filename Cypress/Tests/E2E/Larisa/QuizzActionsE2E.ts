import { addQuizz, adminLogin, baseURL, createUsers, login, userLogin } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { QuizzManagerPage } from "Pages/Larisa/QuizzManagerPage";
import { UserPage } from "Pages/Larisa/UserPage";

describe("Quizz Action Suite", () => {
  let quizzDataID: string;

  before(() => {
    createUsers();
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(baseURL);

    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.quizzes }).as("postQuizz");
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.quizzAction("*", QuizzManagementModels.QuizzActions.Publish) }).as(
      "publishQuizz"
    );
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.quizzAction("*", QuizzManagementModels.QuizzActions.Archive) }).as(
      "archiveQuizz"
    );
    cy.intercept({ method: "DELETE", url: QuizzManagementEndPoints.deleteQuizz("*") }).as("deleteQuizz");

    login(adminLogin);
    addQuizz(QuizzManagementGenerators.quizz);
  });

  it("Publish Quizz Test", () => {
    QuizzManagerPage.saveQuizzBtn().click();
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

  it("Publish Quizz Test And Validate User has permission to this Quizz", () => {
    QuizzManagerPage.saveQuizzBtn().click();
    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzPublishBtn(quizzDataID).click();
      QuizzManagerPage.logoutBtn().click();
      login(userLogin);
      UserPage.quizzListItem(quizzDataID).should("be.visible");
    });
  });

  it("Archive Quizz Test", () => {
    QuizzManagerPage.saveQuizzBtn().click();
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

  it("Archive Quizz Test And Validate User has no permission to this Quizz", () => {
    QuizzManagerPage.saveQuizzBtn().click();
    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzArchiveBtn(quizzDataID).click();
      QuizzManagerPage.logoutBtn().click();
      login(userLogin);
      UserPage.quizzListItem(quizzDataID).should("not.exist");
    });
  });

  it("Delete Quizz Test", () => {
    QuizzManagerPage.saveQuizzBtn().click();
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

  it("Delete Quizz Test And Validate User has no permission to this Quizz", () => {
    QuizzManagerPage.saveQuizzBtn().click();
    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzDeleteBtn(quizzDataID).click();
      QuizzManagerPage.logoutBtn().click();
      login(userLogin);
      UserPage.quizzListItem(quizzDataID).should("not.exist");
    });
  });

  it("Remove question Test", () => {
    QuizzManagerPage.questionListItems()
      .its("length")
      .then((count: number) => {
        QuizzManagerPage.questionRemoveBtn(0).click();
        QuizzManagerPage.questionListItems().its("length").should("be.lt", count);
      });
  });

  it("Remove question option Test", () => {
    QuizzManagerPage.questionOptionListItems(1).then((items) => {
      const initialCount = items.length;
      QuizzManagerPage.questionOptionRemove(1, 1).click();
      QuizzManagerPage.questionOptionListItems(1).should("have.length", initialCount - 1);
    });
  });
});
