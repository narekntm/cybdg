import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { createQuiz, generateUser, login } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
import {
  QuizData,
  QuizStatus,
  QuizSuccessMessages,
  Role,
  User,
  ValidationErrorMessages,
} from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerCommonPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerCommonPage";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";

describe("QuizManager Manager View", () => {
  const baseUrl = "/manager.html";
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;

  before("create a user and login", () => {
    QuizManagerBuilders.Auth().then(() => {
      managerUser = generateUser(Role.Manager);
      regularUser1 = generateUser(Role.User);
      regularUser2 = generateUser(Role.User);

      return Promise.all([
        QuizManagerBuilders.User(managerUser),
        QuizManagerBuilders.User(regularUser1),
        QuizManagerBuilders.User(regularUser2),
      ]);
    });
  });

  beforeEach("login by a created user", () => {
    cy.visit(baseUrl);
    login(managerUser.email, managerUser.password);
    cy.url().should("include", "/manager.html");
  });

  describe("Add Questions", () => {
    it("creates a valid quiz and check if added", () => {
      const generatedQuiz = QuizManagerGenerators.generateQuiz();
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.quizzes() }).as("postQuiz");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");

      createQuiz(generatedQuiz);

      cy.wait("@postQuiz").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include(generatedQuiz);
      });

      cy.wait("@getQuizzes").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        const quizzes = interception.response.body;
        const createdQuiz = quizzes.find(
          (quiz: QuizData) => quiz.title === generatedQuiz.title && quiz.description === generatedQuiz.description
        );

        expect(createdQuiz).to.exist;
        expect(createdQuiz.questions).to.have.length(generatedQuiz.questions.length);
      });

      QuizManagerCommonPage.toastContainer().should("contain", QuizSuccessMessages.QuizSaved);
    });

    it("creates an empty quiz", () => {
      const emptyQuiz = structuredClone(QuizManagerGenerators.generateQuiz());
      emptyQuiz.title = "";
      emptyQuiz.description = "";
      emptyQuiz.questions = [];

      createQuiz(emptyQuiz);

      QuizManagerCommonPage.toastContainer().should("contain", ValidationErrorMessages.TitleRequired);
      QuizManagerCommonPage.toastContainer().should("contain", ValidationErrorMessages.DescriptionRequired);
      QuizManagerCommonPage.toastContainer().should("contain", ValidationErrorMessages.AtLeastOneQuestion);
    });

    it("creates no label and no options questions", () => {
      const noLabelQuestionQuiz = structuredClone(QuizManagerGenerators.generateQuiz());

      noLabelQuestionQuiz.questions.forEach((q) => {
        q.label = "";
      });
      noLabelQuestionQuiz.questions.forEach((q) => {
        q.options = [];
      });
      createQuiz(noLabelQuestionQuiz);
      QuizManagerCommonPage.toastContainer().should("contain", ValidationErrorMessages.MustHaveALabel);
      QuizManagerCommonPage.toastContainer().should("contain", ValidationErrorMessages.AtLeastOneOption);
    });

    it("creates a quiz with selected custom users", () => {
      const selectedUsers = structuredClone(QuizManagerGenerators.generateQuiz());
      selectedUsers.assignedUsers = [regularUser1.email, regularUser2.email];

      createQuiz(selectedUsers);

      QuizManagerCommonPage.toastContainer().should("contain", QuizSuccessMessages.QuizSaved);
    });
    it("creates a quiz with  no selected custom users", () => {
      const noSelectedUsers = structuredClone(QuizManagerGenerators.generateQuiz());
      noSelectedUsers.title = "";
      noSelectedUsers.description = "";
      noSelectedUsers.questions = [];

      noSelectedUsers.assignedUsers = [];

      createQuiz(noSelectedUsers);

      QuizManagerCommonPage.toastContainer().should("contain", ValidationErrorMessages.CustomAssignmentMissingUsers);
    });
  });

  describe("check the action buttons and statuses", () => {
    let createdQuiz: QuizData;

    beforeEach(() => {
      const generatedQuiz = QuizManagerGenerators.generateQuiz();

      return QuizManagerBuilders.createQuiz(generatedQuiz).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({
          ...generatedQuiz,
          status: QuizStatus.Draft,
          createdBy: managerUser.id,
        });
        createdQuiz = response.body;
        cy.visit("/manager.html");
      });
    });

    it("has initial Draft status and action buttons visible", () => {
      QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Draft);
      QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).should("be.visible");
      QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).should("be.visible");
      QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).should("be.visible");
    });

    it("publishes the quiz and updates status & buttons", () => {
      cy.intercept({ method: "PATCH", url: QuizManagerEndpoints.publishQuiz(createdQuiz.id) }).as("publishQuiz");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");

      QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).click();

      cy.wait("@publishQuiz").its("response.statusCode").should("eq", 200);
      cy.wait("@getQuizzes").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include({ ...createdQuiz, status: QuizStatus.Active });
        const quizzesCount = interception.response.body.length;
        QuizManagerManagerViewPage.quizListHeader().should("have.text", `My Quizzes (${quizzesCount})`);
      });

      QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Active);
      QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).should("not.exist");
      QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).should("be.visible");
      QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).should("be.visible");
    });

    it("archives the quiz and updates status & buttons", () => {
      cy.intercept({ method: "PATCH", url: QuizManagerEndpoints.publishQuiz(createdQuiz.id) }).as("publishQuiz");
      QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).click();
      cy.wait("@publishQuiz").its("response.statusCode").should("eq", 200);

      cy.intercept({ method: "PATCH", url: QuizManagerEndpoints.archiveQuiz(createdQuiz.id) }).as("archiveQuiz");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");

      QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).click();

      cy.wait("@archiveQuiz").its("response.statusCode").should("eq", 200);
      cy.wait("@getQuizzes").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include({ ...createdQuiz, status: QuizStatus.Archived });
      });

      QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Archived);
      QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).should("not.exist");
      QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).should("be.visible");
      QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).should("be.visible");
    });

    it("deletes the quiz and removes it from the list", () => {
      cy.intercept({ method: "DELETE", url: QuizManagerEndpoints.quizzes(createdQuiz.id) }).as("deleteQuiz");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");

      QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).click();

      cy.wait("@deleteQuiz").its("response.statusCode").should("eq", 200);
      cy.wait("@getQuizzes").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.not.deep.include(createdQuiz);
      });

      QuizManagerManagerViewPage.quizListSection().should("not.contain", createdQuiz.id);
    });
  });
});
