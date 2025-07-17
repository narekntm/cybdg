import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { QuizzLoginPage } from "Pages/Larisa/QuizzLoginPage";
import { QuizzManagerPage } from "Pages/Larisa/QuizzManagerPage";

describe("QuizzManagement Suite", () => {
  const baseURL = "/login";

  const loginAdminPositiveCase: QuizzManagementModels.Login = {
    email: Cypress.env("ADMIN_EMAIL"),
    password: Cypress.env("ADMIN_PASSWORD"),
  };

  const loginUser1PositiveCase: QuizzManagementModels.Login = {
    email: Cypress.env("USER1_EMAIL"),
    password: Cypress.env("USER1_PASSWORD"),
  };

  const loginNegativeCase: QuizzManagementModels.Login = {
    email: "wrong@email.com",
    password: "wrongPassword",
  };

  function login(login: Partial<QuizzManagementModels.Login>) {
    if (login.email) QuizzLoginPage.emailInput().clear().type(login.email);
    if (login.password) QuizzLoginPage.passwordInput().clear().type(login.password);
  }

  function addQustion(question: Partial<QuizzManagementModels.Question>, index: number) {
    if (question.text) QuizzManagerPage.questionText(index).clear().type(question.text);
    if (question.type) QuizzManagerPage.questionSelect(index).select(question.type);
    if (question.options) QuizzManagerPage.questionOptions(index).clear().type(question.options);
  }

  function addQuizz(quizz: Partial<QuizzManagementModels.Quizz>) {
    if (quizz.title) QuizzManagerPage.quizzTitleInput().clear().type(quizz.title);
    if (quizz.description) QuizzManagerPage.quizzDescTextArea().clear().type(quizz.description);
  }

  before(() => {});

  beforeEach(() => {
    cy.visit(baseURL);

    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.login }).as("postLogin");
    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.quizz() }).as("postQuizz");
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.publish("*") }).as("publishQuizz");
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.archive("*") }).as("archiveQuizz");
    cy.intercept({ method: "DELETE", url: QuizzManagementEndPoints.quizz("*") }).as("deleteQuizz");
    cy.intercept({ method: "GET", url: QuizzManagementEndPoints.users }).as("getUsers");
  });

  afterEach(() => {});

  context("Login to Quizz Management", () => {
    it("Login Modal Content Test", () => {
      QuizzLoginPage.title().should("be.visible").and("have.text", "Login to Quiz Manager");
      QuizzLoginPage.emailLbl().should("be.visible").and("have.text", "Email");
      QuizzLoginPage.emailInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzLoginPage.passwordLbl().should("be.visible").and("have.text", "Password");
      QuizzLoginPage.passwordInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzLoginPage.submitBtn().should("be.visible").and("have.text", "Login");
    });

    it("Login as Admin, Positive case", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      cy.wait("@postLogin").then((xhr) => {
        expect(xhr.request.body).to.include({
          email: loginAdminPositiveCase.email,
          password: loginAdminPositiveCase.password,
        });
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });
      });
    });

    it("Login as User1, Positive case", () => {
      login(loginUser1PositiveCase);
      QuizzLoginPage.submitBtn().click();

      cy.wait("@postLogin").then((xhr) => {
        expect(xhr.request.body).to.include({
          email: loginUser1PositiveCase.email,
          password: loginUser1PositiveCase.password,
        });
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });
      });
    });

    it("Login, Negative case", () => {
      login(loginNegativeCase);
      QuizzLoginPage.submitBtn().click();
    });
  });

  context("Admin Dashboard suite", () => {
    it("Admin Dashboard Modal Content Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      QuizzManagerPage.toggleHeader().should("be.visible").and("have.text", "Create New Quiz");
      QuizzManagerPage.quizzTitleInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzManagerPage.quizzDescTextArea().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzManagerPage.addQuestionBtn().should("be.visible").and("have.text", "+ Add Question");
      QuizzManagerPage.assignToLbl().should("have.text", "Assign To:");

      QuizzManagerPage.assignModeOptions().then((options) => {
        expect(options).to.have.length(2);
        expect(options[0]).to.have.text("All Users");
        expect(options[1]).to.have.text("Selected Users");
      });

      QuizzManagerPage.saveQuizzBtn().should("be.visible").and("have.text", "Save Quiz");
      QuizzManagerPage.quizzListTitle().should("have.text", "My Quizzes");
    });

    it("Add Quizz Test Section Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      QuizzManagerPage.addQuestionBtn().click();
      QuizzManagerPage.questionText(0).should("be.visible").and("be.enabled").and("have.attr", "required");

      QuizzManagerPage.questionSelectOptions(0).should("have.length", 4);
      QuizzManagerPage.questionOptions(0).should("be.visible");
      QuizzManagerPage.questionRemoveBtn(0).should("be.visible").and("have.text", "Remove");
    });

    it("Add Quizz Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);

      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      QuizzManagerPage.quizzListItems()
        .its("length")
        .then((count: number) => {
          QuizzManagerPage.saveQuizzBtn().click();
          cy.wait("@postQuizz").then((xhr) => {
            expect(xhr.response.statusCode).to.eq(200);
            expect(xhr.response.statusMessage).to.eq("OK");
          });
          QuizzManagerPage.quizzListItems().its("length").should("be.gt", count);
        });
    });

    it("Publish Quizz Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      QuizzManagerPage.saveQuizzBtn().click();

      QuizzManagerPage.quizzPublishBtn(0).click();
      cy.wait("@publishQuizz").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");
      });
      QuizzManagerPage.statusBadgeSpan(0).invoke("text").should("eq", "active");
    });

    it("Archive Quizz Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });
      QuizzManagerPage.saveQuizzBtn().click();

      QuizzManagerPage.quizzArchiveBtn(0).click();
      cy.wait("@archiveQuizz").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");
      });
      QuizzManagerPage.statusBadgeSpan(0).invoke("text").should("eq", "archived");
    });

    it("Delete Quizz Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });
      QuizzManagerPage.saveQuizzBtn().click();

      QuizzManagerPage.quizzListItems()
        .its("length")
        .then((count: number) => {
          QuizzManagerPage.quizzDeleteBtn(0).click();
          cy.wait("@deleteQuizz").then((xhr) => {
            expect(xhr.response.statusCode).to.eq(200);
            expect(xhr.response.statusMessage).to.eq("OK");
          });
          QuizzManagerPage.quizzListItems().its("length").should("be.lt", count);
        });
    });

    it("Remove question Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      QuizzManagerPage.questionListItems()
        .its("length")
        .then((count: number) => {
          QuizzManagerPage.questionRemoveBtn(0).click();
          QuizzManagerPage.questionListItems().its("length").should("be.lt", count);
        });
    });

    it("Quizz assign to selected users Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      addQuizz(QuizzManagementGenerators.quizz);

      QuizzManagerPage.assignModeOptions().select("Selected Users");
      cy.wait("@getUsers").then((xhr) => {
        expect(xhr.response.statusCode).to.be.oneOf([200, 304]);
        const userCount = xhr.response.body.length;

        QuizzManagerPage.assignModeOptions().should("have.length", userCount);
      });
    });
  });
});
