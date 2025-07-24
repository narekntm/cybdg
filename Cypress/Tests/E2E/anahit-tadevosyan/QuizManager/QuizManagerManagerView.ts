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
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";

describe("QuizManager Manager View", () => {
  const baseUrl = "http://127.0.0.1:5151/manager.html";
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;
  let createdQuiz: QuizData;

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
    cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
    login(managerUser.email, managerUser.password);
    cy.url().should("include", "/manager.html");
    cy.wait("@postLogin").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });

  describe("Add Questions", () => {
    it("creates a valid quiz and check if added", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.quizzes() }).as("postQuiz");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");

      createQuiz(QuizManagerGenerators.randomQuiz);

      cy.wait("@postQuiz").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include(QuizManagerGenerators.randomQuiz);
      });

      cy.wait("@getQuizzes").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        const quizzes = interception.response.body;
        const createdQuiz = quizzes.find(
          (quiz: QuizData) =>
            quiz.title === QuizManagerGenerators.randomQuiz.title && quiz.description === QuizManagerGenerators.randomQuiz.description
        );

        expect(createdQuiz).to.exist;
        expect(createdQuiz.questions).to.have.length(QuizManagerGenerators.randomQuiz.questions.length);
      });

      QuizManagerManagerViewPage.toastContainer().should("contain", QuizSuccessMessages.QuizSaved);
    });

    it("creates an empty quiz", () => {
      const emptyQuiz = structuredClone(QuizManagerGenerators.randomQuiz);
      emptyQuiz.title = "";
      emptyQuiz.description = "";
      emptyQuiz.questions = [];

      createQuiz(emptyQuiz);

      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.TitleRequired);
      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.DescriptionRequired);
      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.AtLeastOneQuestion);
    });

    it("creates no label questions", () => {
      const noLabelQuestionQuiz = structuredClone(QuizManagerGenerators.randomQuiz);
      noLabelQuestionQuiz.questions[0].label = "";
      createQuiz(noLabelQuestionQuiz);
      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.MustHaveALabel);
    });

    it("creates no option quiz", () => {
      const noOptionQuiz = structuredClone(QuizManagerGenerators.randomQuiz);
      noOptionQuiz.questions[1].options = [];

      createQuiz(noOptionQuiz);

      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.AtLeastOneOption);
    });

    it("creates a quiz with selected custom users", () => {
      const selectedUsers = structuredClone(QuizManagerGenerators.randomQuiz);
      selectedUsers.assignedUsers = [regularUser1.email, regularUser2.email];

      createQuiz(selectedUsers);

      QuizManagerManagerViewPage.toastContainer().should("contain", QuizSuccessMessages.QuizSaved);
    });
    it("creates a quiz with  no selected custom users", () => {
      const noSelectedUsers = structuredClone(QuizManagerGenerators.randomQuiz);
      noSelectedUsers.assignedUsers = [];

      createQuiz(noSelectedUsers);

      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.CustomAssignmentMissingUsers);
    });
  });

  describe("My Quizzes", () => {
    it("checks if the created quiz is seen", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.quizzes() }).as("postQuiz");

      createQuiz(QuizManagerGenerators.randomQuiz);

      cy.wait("@postQuiz").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include(QuizManagerGenerators.randomQuiz);

        createdQuiz = interception.response.body;

        QuizManagerManagerViewPage.quizListSection().should("contain", createdQuiz.title);
        QuizManagerManagerViewPage.titleByQuizId(createdQuiz.id).should("contain", QuizManagerGenerators.randomQuiz.title);
        QuizManagerManagerViewPage.descriptionByQuizId(createdQuiz.id).should("contain", QuizManagerGenerators.randomQuiz.description);
        QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Draft);
      });
    });

    it("checks the action buttons and statuses", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.quizzes() }).as("postQuiz");

      createQuiz(QuizManagerGenerators.randomQuiz);

      cy.wait("@postQuiz").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include(QuizManagerGenerators.randomQuiz);

        createdQuiz = interception.response.body;

        QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Draft);
        QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).should("be.visible");
        QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).should("be.visible");
        QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).should("be.visible");

        cy.intercept({ method: "PATCH", url: QuizManagerEndpoints.publishQuiz(createdQuiz.id) }).as("publishQuiz");
        cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");

        QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).click();

        cy.wait("@publishQuiz").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.deep.include({ success: true });
        });

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

        cy.intercept({ method: "PATCH", url: QuizManagerEndpoints.archiveQuiz(createdQuiz.id) }).as("archiveQuiz");
        cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");

        QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).click();

        cy.wait("@archiveQuiz").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.deep.include({ success: true });
        });

        cy.wait("@getQuizzes").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.deep.include({ ...createdQuiz, status: QuizStatus.Archived });
        });

        QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Archived);
        QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).should("not.exist");
        QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).should("be.visible");
        QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).should("be.visible");

        cy.intercept({ method: "DELETE", url: QuizManagerEndpoints.quizzes(createdQuiz.id) }).as("deleteQuiz");

        QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).click();

        cy.wait("@deleteQuiz").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.deep.include({ success: true });
        });

        cy.wait("@getQuizzes").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.not.deep.include(createdQuiz);
        });

        QuizManagerManagerViewPage.quizListSection().should("not.contain", createdQuiz.id);
      });
    });
  });
});
