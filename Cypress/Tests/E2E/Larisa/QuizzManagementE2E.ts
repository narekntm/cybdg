import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { QuizzAdminDashboardPage } from "Pages/Larisa/QuizzAdminDashboardPage";
import { QuizzManagementLoginPage } from "Pages/Larisa/QuizzManagementLoginPage";

describe("QuizzManagement Suite", () => {
  const baseURL = "/login";

  function login(login: Partial<QuizzManagementModels.Login>) {
    if (login.email) QuizzManagementLoginPage.emailInput().clear().type(login.email);
    if (login.password) QuizzManagementLoginPage.passwordInput().clear().type(login.password);
  }

  function addQustion(question: Partial<QuizzManagementModels.Question>, index: number) {
    if (question.text) QuizzAdminDashboardPage.questionText(index).clear().type(question.text);
    if (question.type) QuizzAdminDashboardPage.questionSelect(index).select(question.type);
    if (question.options) QuizzAdminDashboardPage.questionOptions(index).clear().type(question.options);
  }

  function addQuizz(quizz: Partial<QuizzManagementModels.Quizz>) {
    if (quizz.title) QuizzAdminDashboardPage.quizzTitleInput().clear().type(quizz.title);
    if (quizz.description) QuizzAdminDashboardPage.quizzDescTextArea().clear().type(quizz.description);
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
      QuizzManagementLoginPage.title().should("be.visible").and("have.text", "Login to Quiz Manager");
      QuizzManagementLoginPage.emailLbl().should("be.visible").and("have.text", "Email");
      QuizzManagementLoginPage.emailInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzManagementLoginPage.passwordLbl().should("be.visible").and("have.text", "Password");
      QuizzManagementLoginPage.passwordInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzManagementLoginPage.submitBtn().should("be.visible").and("have.text", "Login");
    });

    it("Login as Admin, Positive case", () => {
      login(QuizzManagementGenerators.loginAdminPositiveCase);
      QuizzManagementLoginPage.submitBtn().click();

      cy.wait("@postLogin").then((xhr) => {
        expect(xhr.request.body).to.include({
          email: QuizzManagementGenerators.loginAdminPositiveCase.email,
          password: QuizzManagementGenerators.loginAdminPositiveCase.password,
        });
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });
      });
    });

    it("Login as User1, Positive case", () => {
      login(QuizzManagementGenerators.loginUser1PositiveCase);
      QuizzManagementLoginPage.submitBtn().click();

      cy.wait("@postLogin").then((xhr) => {
        expect(xhr.request.body).to.include({
          email: QuizzManagementGenerators.loginUser1PositiveCase.email,
          password: QuizzManagementGenerators.loginUser1PositiveCase.password,
        });
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });
      });
    });

    it("Login, Negative case", () => {
      login(QuizzManagementGenerators.loginNegativeCase);
      QuizzManagementLoginPage.submitBtn().click();
      //QuizzManagementLoginPage.errorMessage().should("be.visible").and("have.text", "Invalid credentials.");
    });
  });

  context("Admin Dashboard suite", () => {
    it("Admin Dashboard Modal Content Test", () => {
      login(QuizzManagementGenerators.loginAdminPositiveCase);
      QuizzManagementLoginPage.submitBtn().click();

      QuizzAdminDashboardPage.title().should("be.visible").and("have.text", "Create New Quiz");
      QuizzAdminDashboardPage.quizzTitleInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzAdminDashboardPage.quizzDescTextArea().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzAdminDashboardPage.addQuestionBtn().should("be.visible").and("have.text", "+ Add Question");
      QuizzAdminDashboardPage.assignToLbl().should("have.text", "Assign To:");

      QuizzAdminDashboardPage.assignModeOptions().then((options) => {
        expect(options).to.have.length(2);
        expect(options[0]).to.have.text("All Users");
        expect(options[1]).to.have.text("Selected Users");
      });

      QuizzAdminDashboardPage.saveQuizzBtn().should("be.visible").and("have.text", "Save Quiz");
      QuizzAdminDashboardPage.quizzListTitle().should("have.text", "My Quizzes");
    });

    it("Add Quizz Test Section Test", () => {
      login(QuizzManagementGenerators.loginAdminPositiveCase);
      QuizzManagementLoginPage.submitBtn().click();

      QuizzAdminDashboardPage.addQuestionBtn().click();
      QuizzAdminDashboardPage.questionText(0).should("be.visible").and("be.enabled").and("have.attr", "required");

      QuizzAdminDashboardPage.questionSelectOptions(0).should("have.length", 4);
      QuizzAdminDashboardPage.questionOptions(0).should("be.visible");
      QuizzAdminDashboardPage.questionRemoveBtn(0).should("be.visible").and("have.text", "Remove");
    });

    it("Add Quizz Test", () => {
      login(QuizzManagementGenerators.loginAdminPositiveCase);
      QuizzManagementLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);

      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzAdminDashboardPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      QuizzAdminDashboardPage.quizzListItems()
        .its("length")
        .then((count: number) => {
          QuizzAdminDashboardPage.saveQuizzBtn().click();
          cy.wait("@postQuizz").then((xhr) => {
            expect(xhr.response.statusCode).to.eq(200);
            expect(xhr.response.statusMessage).to.eq("OK");
          });
          QuizzAdminDashboardPage.quizzListItems().its("length").should("be.gt", count);
        });
    });

    it("Publish Quizz Test", () => {
      login(QuizzManagementGenerators.loginAdminPositiveCase);
      QuizzManagementLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzAdminDashboardPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      QuizzAdminDashboardPage.saveQuizzBtn().click();

      QuizzAdminDashboardPage.quizzPublishBtn(0).click();
      cy.wait("@publishQuizz").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");
      });
      QuizzAdminDashboardPage.statusBadgeSpan(0).invoke("text").should("eq", "active");
    });

    it("Archive Quizz Test", () => {
      login(QuizzManagementGenerators.loginAdminPositiveCase);
      QuizzManagementLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzAdminDashboardPage.addQuestionBtn().click();
        addQustion(item, index);
      });
      QuizzAdminDashboardPage.saveQuizzBtn().click();

      QuizzAdminDashboardPage.quizzArchiveBtn(0).click();
      cy.wait("@archiveQuizz").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");
      });
      QuizzAdminDashboardPage.statusBadgeSpan(0).invoke("text").should("eq", "archived");
    });

    it.only("Delete Quizz Test", () => {
      login(QuizzManagementGenerators.loginAdminPositiveCase);
      QuizzManagementLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzAdminDashboardPage.addQuestionBtn().click();
        addQustion(item, index);
      });
      QuizzAdminDashboardPage.saveQuizzBtn().click();

      QuizzAdminDashboardPage.quizzListItems()
        .its("length")
        .then((count: number) => {
          QuizzAdminDashboardPage.quizzDeleteBtn(0).click();
          cy.wait("@deleteQuizz").then((xhr) => {
            expect(xhr.response.statusCode).to.eq(200);
            expect(xhr.response.statusMessage).to.eq("OK");
          });
          QuizzAdminDashboardPage.quizzListItems().its("length").should("be.lt", count);
        });
    });

    it("Remove question Test", () => {
      login(QuizzManagementGenerators.loginAdminPositiveCase);
      QuizzManagementLoginPage.submitBtn().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzAdminDashboardPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      QuizzAdminDashboardPage.questionListItems()
        .its("length")
        .then((count: number) => {
          QuizzAdminDashboardPage.questionRemoveBtn(0).click();
          QuizzAdminDashboardPage.questionListItems().its("length").should("be.lt", count);
        });
    });

    it("Quizz assign to selected users Test", () => {
      login(QuizzManagementGenerators.loginAdminPositiveCase);
      QuizzManagementLoginPage.submitBtn().click();
      addQuizz(QuizzManagementGenerators.quizz);

      QuizzAdminDashboardPage.assignMode().select("Selected Users");
      cy.wait("@getUsers").then((xhr) => {
        expect(xhr.response.statusCode).to.be.oneOf([200, 304]);
        const userCount = xhr.response.body.length;

        QuizzAdminDashboardPage.assignModeOptions().should("have.length", userCount);
      });
    });
  });
});
