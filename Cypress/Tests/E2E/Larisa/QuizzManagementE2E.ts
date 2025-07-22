import { QuizzManagementBuilders } from "Builders/Larisa/QuizzManagementBuilders";
import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { UserManagementModels } from "Models/Larisa/UserManagementModels";
import { CommonPage } from "Pages/Larisa/CommonPage";
import { QuizzLoginPage } from "Pages/Larisa/QuizzLoginPage";
import { QuizzManagerPage } from "Pages/Larisa/QuizzManagerPage";
import { QuizzViewPage } from "Pages/Larisa/QuizzViewPage";
import { QuizzViewSubmissionsPage } from "Pages/Larisa/QuizzViewSubmissionsPage";
import { UserPage } from "Pages/Larisa/UserPage";

describe("QuizzManagement Suite", () => {
  const baseURL = "/login";
  let manager: UserManagementModels.User;
  let user: UserManagementModels.User;
  let adminLogin: UserManagementModels.Login;
  let userLogin: UserManagementModels.Login;

  let quizzDataID: string;

  const quizzErrors = {
    titleError: "Quiz title cannot be empty.",
    descError: "Quiz description cannot be empty.",
    questionError: "At least one question is required.",
  };

  const loginNegativeCase: UserManagementModels.Login = {
    email: "wrong@email.com",
    password: "wrongPassword",
  };

  function login(login: Partial<UserManagementModels.Login>) {
    if (login.email) QuizzLoginPage.emailInput().clear().type(login.email);
    if (login.password) QuizzLoginPage.passwordInput().clear().type(login.password);
    QuizzLoginPage.submitBtn().click();
  }

  function addQuizz(quizz: Partial<QuizzManagementModels.Quizz>) {
    QuizzManagerPage.toggleHeader().click();
    if (quizz.title) QuizzManagerPage.quizzTitleInput().clear().type(quizz.title);
    if (quizz.description) QuizzManagerPage.quizzDescTextArea().clear().type(quizz.description);

    QuizzManagementGenerators.quizz.question.forEach((question, index) => {
      QuizzManagerPage.addQuestionBtn().click();

      if (question.text) QuizzManagerPage.questionText(index).clear().type(question.text);
      if (question.type) QuizzManagerPage.questionSelect(index).select(question.type);
      if (question.options) {
        const optionsArray = question.options.split(",").map((option) => option.trim());
        optionsArray.forEach((option) => {
          QuizzManagerPage.questionOptions(index).clear().type(`${option}{enter}`);
        });
      }
    });

    QuizzManagementBuilders.getUsers().then(() => {
      QuizzManagerPage.assignModeSelect().select("Selected Users");
      QuizzManagerPage.userCheckBoxesItems().filter(`[value="${user.email}"]`).check();
    });
  }

  before(() => {
    QuizzManagementBuilders.auth().then((responce) => {
      cy.setCookie("authToken", responce.body.token);
    });

    manager = QuizzManagementGenerators.user(UserManagementModels.UserRole.Manager);
    QuizzManagementBuilders.postUser(manager).then((responce) => {
      expect(responce.status).to.be.oneOf([200, 201]);
      expect(responce.statusText).to.eq("Created");
      adminLogin = { email: manager.email, password: manager.password };

      Cypress.env("manager", manager);
      const savedUser = Cypress.env("manager");
      expect(savedUser).to.exist;
      expect(savedUser.email).to.eq(manager.email);
    });

    user = QuizzManagementGenerators.user(UserManagementModels.UserRole.User);
    QuizzManagementBuilders.postUser(user).then((responce) => {
      expect(responce.status).to.be.oneOf([200, 201]);
      expect(responce.statusText).to.eq("Created");
      Cypress.env("user", user);
      userLogin = { email: user.email, password: user.password };
    });
  });

  beforeEach(() => {
    cy.visit(baseURL);

    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.login }).as("postLogin");
    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.quizzes }).as("postQuizz");
    cy.intercept({ method: "GET", url: QuizzManagementEndPoints.quizzes }).as("getQuizz");
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.publishQuizz("*") }).as("publishQuizz");
    cy.intercept({ method: "PATCH", url: QuizzManagementEndPoints.archiveQuizz("*") }).as("archiveQuizz");
    cy.intercept({ method: "DELETE", url: QuizzManagementEndPoints.deleteQuizz("*") }).as("deleteQuizz");
    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.postSubmissions("*") }).as("submitQuizz");
    cy.intercept({ method: "GET", url: QuizzManagementEndPoints.getSubmissions("*") }).as("getSubmission");
    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.users }).as("postUser");
  });

  context("Login Page UI Suite", () => {
    it("Login Modal Content Test", () => {
      QuizzLoginPage.title().should("be.visible").and("have.text", "Login to Quizz Manager");
      QuizzLoginPage.emailLbl().should("be.visible").and("contain.text", "Email");
      QuizzLoginPage.emailInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzLoginPage.passwordLbl().should("be.visible").and("contain.text", "Password");
      QuizzLoginPage.passwordInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzLoginPage.submitBtn().should("be.visible").and("contain.text", "Login");
    });
  });

  context("Login to Quizz AS Manager Suite", () => {
    beforeEach(() => {
      login(adminLogin);
    });

    it("Login as Manager, Positive case", () => {
      cy.wait("@postLogin").then((xhr) => {
        expect(xhr.request.body).to.include({
          email: adminLogin.email,
          password: adminLogin.password,
        });
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });
      });
    });

    it("Login as Manager, Positive case, validate cookie", () => {
      cy.getCookie("authToken")
        .should("exist")
        .and((cookie) => {
          expect(cookie.value).to.not.be.empty;
        });
    });
  });

  context("Login to Quizz AS User Suite", () => {
    it("Login as User1, Positive case", () => {
      login(userLogin);
      cy.wait("@postLogin").then((xhr) => {
        expect(xhr.request.body).to.include({
          email: userLogin.email,
          password: userLogin.password,
        });
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });

        UserPage.quizzesSection().should("be.visible");
        UserPage.quizzesSectionTitle().should("be.visible").and("contain.text", "Available Quizzes");
      });
    });
  });

  context("Login to Quizz Negative Case Suite", () => {
    it("Login, Negative case", () => {
      login(loginNegativeCase);
      CommonPage.toast().should("be.visible").and("have.text", "Login failed: Invalid credentials");
    });
  });

  context("Admin Dashboard Suite", () => {
    beforeEach(() => {
      login(adminLogin);
    });

    it("Admin Dashboard Modal Content Test", () => {
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
      QuizzManagerPage.quizzListCount().should("contain.text", "(0)");
    });

    it("Add Quizz Question Section Test", () => {
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
      QuizzManagerPage.toggleHeader().click();
      QuizzManagerPage.addQuestionBtn().click();

      QuizzManagerPage.questionSelect(0).select(QuizzManagementModels.QuestionType.Radio);
      QuizzManagerPage.questionOptions(0).clear().type("Option 1");
      QuizzManagerPage.addOptionInputBtn(0).click();
      QuizzManagerPage.questionOptions(0).clear().type("Option 2{enter}");
      QuizzManagerPage.questionOptionListItems(0).its("length").should("be.eq", 2);
    });

    it("Add Quizz Test, Validate Data", () => {
      addQuizz(QuizzManagementGenerators.quizz);

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
      let quizzesCount = 0;
      cy.wait("@getQuizz").then((xhr) => {
        quizzesCount = xhr.response.body.length;
        expect(xhr.response.statusCode).to.be.oneOf([200, 304]);

        addQuizz(QuizzManagementGenerators.quizz);
        QuizzManagerPage.saveQuizzBtn().click();
        cy.wait("@postQuizz").then((xhr) => {
          expect(xhr.response.statusCode).to.be.oneOf([200, 304]);
        });

        QuizzManagerPage.quizzListItems().its("length").should("be.gt", quizzesCount);
      });
    });

    it("Add Quizz Test, Negative Case", () => {
      QuizzManagerPage.toggleHeader().click();
      QuizzManagerPage.saveQuizzBtn().click();
      CommonPage.toast()
        .should("be.visible")
        .and("have.text", `• ${quizzErrors.titleError}• ${quizzErrors.descError}• ${quizzErrors.questionError}`);
    });

    it("Assign To User Test", () => {
      QuizzManagerPage.toggleHeader().click();
      QuizzManagerPage.assignModeSelect().select("Selected Users");
      QuizzManagerPage.userCheckBoxes().should("be.visible");
    });

    it("My Quizzes Structure Test", () => {
      addQuizz(QuizzManagementGenerators.quizz);

      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        quizzDataID = xhr.response.body.id;
        QuizzManagerPage.quizzTitle(quizzDataID).should("contain.text", QuizzManagementGenerators.quizz.title);
        QuizzManagerPage.statusBadgeSpan(quizzDataID).invoke("text").should("eq", "draft");
        QuizzManagerPage.quizzDesc(quizzDataID).should("have.text", `Description: ${QuizzManagementGenerators.quizz.description}`);
        QuizzManagerPage.viewSubmission(quizzDataID).should("be.visible").and("have.text", "View Submissions");

        QuizzManagerPage.quizzPublishBtn(quizzDataID).should("be.visible");
        QuizzManagerPage.quizzArchiveBtn(quizzDataID).should("be.visible");
        QuizzManagerPage.quizzDeleteBtn(quizzDataID).should("be.visible");

        QuizzManagerPage.quizzListTitle().should("contain.text", "My Quizzes");
      });
    });
  });

  context("Quizz Actions Suite", () => {
    beforeEach(() => {
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
  });

  context("Logout Suite", () => {
    it("Logout Test", () => {
      login(adminLogin);
      QuizzManagerPage.logoutBtn().click();
      cy.getCookie("authToken").should("not.exist");
    });
  });

  context("View Submission Suite", () => {
    it("No Submission Yet test", () => {
      login(adminLogin);
      addQuizz(QuizzManagementGenerators.quizz);

      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        quizzDataID = xhr.response.body.id;
        QuizzManagerPage.viewSubmission(quizzDataID).click();
        QuizzViewSubmissionsPage.quizzTitle().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.title);
        QuizzViewSubmissionsPage.quizzDesc().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.description);
        QuizzViewSubmissionsPage.submissionListInfo().should("be.visible").and("have.text", "No submissions yet.");
      });
    });
  });

  context("User Quizz Suite", () => {
    it("Admin Creates and Publishes Quiz", () => {
      login(adminLogin);
      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagerPage.saveQuizzBtn().click();

      cy.wait("@postQuizz").then((xhr) => {
        quizzDataID = xhr.response.body.id;
        Cypress.env("quizID", quizzDataID);

        QuizzManagerPage.quizzPublishBtn(quizzDataID).click();
        QuizzManagerPage.logoutBtn().click();
      });
    });

    it("User Submits Quiz", () => {
      const quizzDataID = Cypress.env("quizID");
      expect(quizzDataID, "Quiz ID must exist").to.exist;

      login(userLogin);

      UserPage.quizzListItem(quizzDataID).should("be.visible");
      UserPage.quizzListItemButton(quizzDataID).click();

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
      QuizzViewPage.questionOptionList(1).eq(0).check();
      QuizzViewPage.questionOptionList(2).eq(0).check();
      QuizzViewPage.questionOptionSelect(3).select(0);

      QuizzViewPage.submitBtn().click();

      cy.wait("@submitQuizz").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        Cypress.env("submissionID", xhr.response.body.id);
        QuizzManagerPage.logoutBtn().click();
      });
    });

    it("Admin Validates User Submission", () => {
      const quizzDataID = Cypress.env("quizID");
      const submissionID = Cypress.env("submissionID");

      expect(quizzDataID, "Quiz ID must exist").to.exist;
      expect(submissionID, "Submission ID must exist").to.exist;
      login(adminLogin);

      QuizzManagementBuilders.getSubmissions(quizzDataID).then((response) => {
        const submission = response.body.find((sub: QuizzManagementModels.Submission) => sub.id === submissionID);
        expect(submission).to.exist;
        QuizzManagerPage.viewSubmission(submission.quizId).click();
        QuizzViewSubmissionsPage.submissionCard(submission.id).click();

        QuizzManagerPage.quizzInfoTitle().should("contain.text", QuizzManagementGenerators.quizz.title);
        QuizzManagerPage.quizzDescription().should("contain.text", QuizzManagementGenerators.quizz.description);

        QuizzViewSubmissionsPage.submissionCardName(submission.id).should("contain.text", "Submission #");
        QuizzViewSubmissionsPage.submissionCardUser(submission.id).should("contain.text", user.id);
        QuizzViewSubmissionsPage.submissionCardCreated(submission.id).should(
          "contain.text",
          `Created At: ${new Date(submission.createdAt).toLocaleString()}`
        );

        QuizzViewSubmissionsPage.questionTitle(submission.id, 0).should("contain.text", QuizzManagementGenerators.quizz.question[0].text);
        QuizzManagementGenerators.quizz.question.forEach((question, index) => {
          QuizzViewSubmissionsPage.questionTitle(submission.id, index).should("contain.text", question.text);
        });

        QuizzViewSubmissionsPage.questionAnswer(submission.id, 0).should("contain.text", submission.answers.q0);
        QuizzViewSubmissionsPage.questionAnswer(submission.id, 1).should("contain.text", submission.answers.q1);
        QuizzViewSubmissionsPage.questionAnswer(submission.id, 2).should("contain.text", submission.answers.q2);
        QuizzViewSubmissionsPage.questionAnswer(submission.id, 3).should("contain.text", submission.answers.q3);
      });
    });
  });
});
