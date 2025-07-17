import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { QuizzLoginPage } from "Pages/Larisa/QuizzLoginPage";
import { QuizzManagerPage } from "Pages/Larisa/QuizzManagerPage";
import { QuizzViewPage } from "Pages/Larisa/QuizzViewPage";
import { QuizzViewSubmissionsPage } from "Pages/Larisa/QuizzViewSubmissionsPage";
import { UserPage } from "Pages/Larisa/UserPage";

describe("QuizzManagement Suite", () => {
  const baseURL = "/login";

  const quizzErrors = {
    titleError: "Quiz title cannot be empty.",
    descError: "Quiz description cannot be empty.",
    questionError: "At least one question is required.",
  };

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
    if (question.options) {
      const optionsArray = question.options.split(",").map((option) => option.trim());
      optionsArray.forEach((option) => {
        QuizzManagerPage.questionOptions(index).clear().type(`${option}{enter}`);
      });
    }
  }

  function addQuizz(quizz: Partial<QuizzManagementModels.Quizz>) {
    if (quizz.title) QuizzManagerPage.quizzTitleInput().clear().type(quizz.title);
    if (quizz.description) QuizzManagerPage.quizzDescTextArea().clear().type(quizz.description);
  }

  before(() => {});

  beforeEach(() => {
    cy.visit(baseURL);

    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.login }).as("postLogin");
    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.quizzes }).as("postQuizz");
    cy.intercept({ method: "GET", url: QuizzManagementEndPoints.quizzes }).as("getQuizz");
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.publish("*") }).as("publishQuizz");
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.archive("*") }).as("archiveQuizz");
    cy.intercept({ method: "DELETE", url: QuizzManagementEndPoints.delete("*") }).as("deleteQuizz");
    cy.intercept({ method: "GET", url: QuizzManagementEndPoints.users }).as("getUsers");
  });

  afterEach(() => {});

  context("Login to Quizz Management Suite", () => {
    it("Login Modal Content Test", () => {
      QuizzLoginPage.title().should("be.visible").and("have.text", "Login to Quizz Manager");
      QuizzLoginPage.emailLbl().should("be.visible").and("contain.text", "Email");
      QuizzLoginPage.emailInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzLoginPage.passwordLbl().should("be.visible").and("contain.text", "Password");
      QuizzLoginPage.passwordInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzLoginPage.submitBtn().should("be.visible").and("contain.text", "Login");
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

    it("Login as Admin, Positive case and validate cookie", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      cy.getCookie("authToken")
        .should("exist")
        .and((cookie) => {
          expect(cookie.value).to.not.be.empty;
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
      QuizzLoginPage.toast().should("be.visible").and("have.text", "Login failed: Invalid credentials");
    });
  });

  context("Admin Dashboard Suite", () => {
    it("Admin Dashboard Modal Content Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      QuizzManagerPage.toggleHeader().should("be.visible").and("have.text", "Create New Quizz");
      QuizzManagerPage.toggleHeader().click();

      QuizzManagerPage.quizzTitleLbl().should("be.visible").and("contain.text", "Quizz Title");
      QuizzManagerPage.quizzTitleInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzManagerPage.quizzDescLbl().should("be.visible").and("contain.text", "Quizz Description");
      QuizzManagerPage.quizzDescTextArea().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzManagerPage.addQuestionBtn().should("be.visible").and("have.text", "+ Add Question");
      QuizzManagerPage.assignToLbl().should("have.text", "Assign To:");
      QuizzManagerPage.assignModeOptions().then((options) => {
        expect(options).to.have.length(2);
        expect(options[0]).to.have.text("All Users");
        expect(options[1]).to.have.text("Selected Users");
      });
      QuizzManagerPage.saveQuizzBtn().should("be.visible").and("have.text", "Save Quizz");
      QuizzManagerPage.quizzListTitle().should("contain.text", "My Quizzes");
    });

    it("Add Quizz Question Section Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();

      QuizzManagerPage.toggleHeader().click();
      QuizzManagerPage.addQuestionBtn().should("be.visible");
      QuizzManagerPage.addQuestionBtn().click();

      QuizzManagerPage.questionText(0).should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzManagerPage.questionSelectOptions(0).should("have.length", 4);
      QuizzManagerPage.questionRemoveBtn(0).should("be.visible").and("have.text", "Remove");

      QuizzManagerPage.questionSelect(0).select(QuizzManagementModels.QuestionType.Input);
      QuizzManagerPage.questionOptions(0).should("not.be.visible");
      QuizzManagerPage.addOptionInputBtn(0).should("not.be.visible");

      QuizzManagerPage.questionSelect(0).select(QuizzManagementModels.QuestionType.Radio);
      QuizzManagerPage.questionOptions(0).should("be.visible");
      QuizzManagerPage.addOptionInputBtn(0).should("be.visible");
    });

    it("Add Option Text to question Section Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();
      QuizzManagerPage.addQuestionBtn().click();

      QuizzManagerPage.questionSelect(0).select(QuizzManagementModels.QuestionType.Radio);
      QuizzManagerPage.questionOptions(0).clear().type("Option 1");
      QuizzManagerPage.addOptionInputBtn(0).click();

      QuizzManagerPage.questionOptions(0).clear().type("Option 2{enter}");

      QuizzManagerPage.questionOptionListItems(0).its("length").should("be.eq", 2);
    });

    it("Add Quizz Test, Validate Data", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();

      addQuizz(QuizzManagementGenerators.quizz);

      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      QuizzManagerPage.quizzTitleInput().should("have.value", QuizzManagementGenerators.quizz.title);
      QuizzManagerPage.quizzDescTextArea().should("have.value", QuizzManagementGenerators.quizz.description);

      QuizzManagementGenerators.quizz.question.forEach((question, index) => {
        QuizzManagerPage.questionText(index).should("have.value", question.text);
        QuizzManagerPage.questionSelect(index).should("have.value", question.type.toLowerCase());
        if (question.options) {
          const optionsArray = question.options.split(",").map((option) => option.trim());
          optionsArray.forEach((option, optionIndex) => {
            QuizzManagerPage.questionOptionSpan(index, optionIndex).should("have.text", option);
          });
        }
      });
    });

    it("Add Quizz Test, Positive Case", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();
      let quizzesCount = 0;
      cy.wait("@getQuizz").then((xhr) => {
        quizzesCount = xhr.response.body.length;
        expect(xhr.response.statusCode).to.be.oneOf([200, 304]);

        addQuizz(QuizzManagementGenerators.quizz);
        QuizzManagementGenerators.quizz.question.forEach((item, index) => {
          QuizzManagerPage.addQuestionBtn().click();
          addQustion(item, index);
        });

        QuizzManagerPage.saveQuizzBtn().click();
        cy.wait("@postQuizz").then((xhr) => {
          expect(xhr.response.statusCode).to.be.oneOf([200, 304]);
        });

        QuizzManagerPage.quizzListItems().its("length").should("be.gt", quizzesCount);
      });
    });

    it("Add Quizz Test, Negative Case", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();

      QuizzManagerPage.saveQuizzBtn().click();
      QuizzLoginPage.toast()
        .should("be.visible")
        .and("have.text", `• ${quizzErrors.titleError}• ${quizzErrors.descError}• ${quizzErrors.questionError}`);
    });

    it("My Quizzes Structure Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();

      let users: QuizzManagementModels.Login[];
      cy.request({
        method: "GET",
        url: QuizzManagementEndPoints.users,
      }).then((response) => {
        users = response.body;
        QuizzManagerPage.assignModeSelect().select("Selected Users");
        QuizzManagerPage.userCheckBoxes().should("be.visible");
        QuizzManagerPage.userCheckBoxesItems().should("have.length", response.body.length);

        QuizzManagerPage.userCheckBoxesItems().each(($checkbox) => {
          cy.wrap($checkbox).then(($el) => {
            if (!$el.is(":checked")) {
              cy.wrap($el).check();
            }
          });
        });
      });

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      let dataID;
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        dataID = xhr.response.body.id;
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");

        QuizzManagerPage.quizzTitle(dataID).should("contain.text", QuizzManagementGenerators.quizz.title);
        QuizzManagerPage.statusBadgeSpan(dataID).invoke("text").should("eq", "draft");
        QuizzManagerPage.quizzDescription(dataID).should("have.text", "Description: " + QuizzManagementGenerators.quizz.description);
        QuizzManagerPage.quizzAssignees(dataID).should("have.text", "Users: " + users.map((user) => user.email).join(", "));
        QuizzManagerPage.viewSubmission(dataID).should("be.visible").and("have.text", "View Submissions");

        QuizzManagerPage.quizzPublishBtn(dataID).should("be.visible");
        QuizzManagerPage.quizzArchiveBtn(dataID).should("be.visible");
        QuizzManagerPage.quizzDeleteBtn(dataID).should("be.visible");
      });
    });

    it("Publish Quizz Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      let dataID;
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        dataID = xhr.response.body.id;
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");

        QuizzManagerPage.quizzPublishBtn(dataID).click();
        cy.wait("@publishQuizz").then((xhr) => {
          expect(xhr.response.statusCode).to.eq(200);
          expect(xhr.response.statusMessage).to.eq("OK");
        });
        QuizzManagerPage.statusBadgeSpan(dataID).invoke("text").should("eq", "active");
      });
    });

    it("Archive Quizz Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      let dataID;
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        dataID = xhr.response.body.id;
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");

        QuizzManagerPage.quizzArchiveBtn(dataID).click();
        cy.wait("@archiveQuizz").then((xhr) => {
          expect(xhr.response.statusCode).to.eq(200);
          expect(xhr.response.statusMessage).to.eq("OK");
        });
        QuizzManagerPage.statusBadgeSpan(dataID).invoke("text").should("eq", "archived");
      });
    });

    it("Delete Quizz Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      let dataID;
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        dataID = xhr.response.body.id;
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");

        QuizzManagerPage.quizzDeleteBtn(dataID).click();
        cy.wait("@deleteQuizz").then((xhr) => {
          expect(xhr.response.statusCode).to.eq(200);
          expect(xhr.response.statusMessage).to.eq("OK");
        });
      });
    });

    it("Remove question Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();

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
      QuizzManagerPage.toggleHeader().click();

      cy.request({
        method: "GET",
        url: QuizzManagementEndPoints.users,
      }).then((response) => {
        QuizzManagerPage.assignModeOptions().should("have.length", response.body.length);
      });
    });

    it("Logout Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.logoutBtn().click();
      cy.getCookie("authToken").should("not.exist");
    });
  });

  context("View Submission Suite", () => {
    it("No Submission Yet test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      let dataID;
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        dataID = xhr.response.body.id;
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.statusMessage).to.eq("OK");

        QuizzManagerPage.viewSubmission(dataID).click();

        QuizzViewSubmissionsPage.quizzTitle().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.title);
        QuizzViewSubmissionsPage.quizzDesc().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.description);
        QuizzViewSubmissionsPage.submissionListInfo().should("be.visible").and("have.text", "No submissions yet.");
      });
    });
  });

  context("User Quizz Suite", () => {
    it("Submitted Quizzes Test", () => {
      login(loginAdminPositiveCase);
      QuizzLoginPage.submitBtn().click();
      QuizzManagerPage.toggleHeader().click();

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagementGenerators.quizz.question.forEach((item, index) => {
        QuizzManagerPage.addQuestionBtn().click();
        addQustion(item, index);
      });

      cy.request({
        method: "GET",
        url: QuizzManagementEndPoints.users,
      }).then(() => {
        QuizzManagerPage.assignModeSelect().select("Selected Users");
        QuizzManagerPage.userCheckBoxesItems().each(($checkbox) => {
          cy.wrap($checkbox).then(($el) => {
            if (!$el.is(":checked")) {
              cy.wrap($el).check();
            }
          });
        });
      });

      let dataID;
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        dataID = xhr.response.body.id;
        QuizzManagerPage.quizzPublishBtn(dataID).click();

        QuizzManagerPage.saveQuizzBtn().click();
        QuizzManagerPage.logoutBtn().click();
        login(loginUser1PositiveCase);
        QuizzLoginPage.submitBtn().click();

        UserPage.quizzesSection().should("be.visible");
        UserPage.quizzesSectionTitle().should("be.visible").and("contain.text", "Available Quizzes");
        UserPage.quizzListItem(dataID).should("be.visible");
        UserPage.quizzListItemStrong(dataID).should("be.visible").and("have.text", QuizzManagementGenerators.quizz.title);

        UserPage.quizzListItemButton(dataID).click();
        QuizzViewPage.quizzTitle().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.title);
        QuizzViewPage.quizzDesc().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.description);
        QuizzViewPage.submitBtn().should("be.visible").and("have.text", "Submit");

        QuizzManagementGenerators.quizz.question.forEach((item, index) => {
          QuizzViewPage.question(index).should("be.visible");
          QuizzViewPage.questionHeader(index).should("be.visible").and("have.text", item.text);

          if (item.type === QuizzManagementModels.QuestionType.Radio || item.type === QuizzManagementModels.QuestionType.Checkbox) {
            QuizzViewPage.questionOptionList(index)
              .should("be.visible")
              .and("have.length", QuizzManagementGenerators.quizz.question[index].options.split(",").map((item) => item.trim()).length);
          } else if (item.type === QuizzManagementModels.QuestionType.Dropdown) {
            QuizzViewPage.questionOptionSelect(index).should("be.visible");
            QuizzViewPage.questionOptionSelectOptions(index).should(
              "have.length",
              QuizzManagementGenerators.quizz.question[index].options.split(",").map((item) => item.trim()).length
            );
          }
        });

        QuizzViewPage.questionInput(0).clear().type("Larisa");
        QuizzViewPage.questionOptionList(1).check("Female");
        QuizzViewPage.questionOptionList(2).check("Travelling");
        QuizzViewPage.questionOptionSelect(3).select("Armenia");
        QuizzViewPage.submitBtn().click();

        QuizzManagerPage.logoutBtn().click();
        login(loginAdminPositiveCase);
        QuizzLoginPage.submitBtn().click();

        QuizzManagerPage.viewSubmission(dataID).click();
        QuizzViewSubmissionsPage.submissionItem(dataID).should("be.visible");
      });
    });
  });
});
