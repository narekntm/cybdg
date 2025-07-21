import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { frontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { createAndPublishQuiz, fillQuizFormUI, loginViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { ValidationErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import {
  AssignedUsers,
  QuestionType,
  QuizResponse,
  QuizStatus,
  QuizSuccessMessages,
  TestAssertionMessages,
  UserCredentials,
  UserRole,
} from "Models/Arthur/QuizManager/QuizManagerModels";
import { ManagerPage } from "Pages/Arthur/QuizManager/ManagerPage";

describe("Manager Dashboard", () => {
  let manager: UserCredentials;
  let user1: UserCredentials;
  let user2: UserCredentials;

  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((u) => (manager = u));
    TestUserBuilder.createUser(UserRole.User).then((u) => (user1 = u));
    TestUserBuilder.createUser(UserRole.User).then((u) => (user2 = u));
  });

  beforeEach(() => {
    loginViaApi(manager);
    cy.visit(frontendRoutes.Manager);
  });

  context("Manager sees only their own quizzes", () => {
    const quizTitles: string[] = [];
    beforeEach(() => {
      loginViaApi(manager);
      cy.intercept("GET", QuizManagerEndpoints.quizzes).as("getQuizzes");

      [1, 2].forEach(() => {
        const quiz = QuizGenerator.generateQuizWithAllTypes();
        quizTitles.push(quiz.title);
        createAndPublishQuiz(quiz);
      });

      cy.visit(frontendRoutes.Manager);
    });

    it("Shows only quizzes created by this manager (API and UI)", () => {
      cy.wait("@getQuizzes").then((interception) => {
        const quizzes: QuizResponse[] = (interception.response && interception.response.body) || [];
        quizzes.forEach((quiz) => {
          expect(quiz.createdBy).to.eq(manager.id);
        });
        quizTitles.forEach((title) => {
          expect(quizzes.some((q) => q.title === title)).to.be.true;
        });
      });

      quizTitles.forEach((title) => {
        ManagerPage.quizItemByTitle(title).should("exist");
      });
      ManagerPage.managerUsername().should("contain", manager.id);
    });
  });

  context("Quiz creation", () => {
    it("Shows validation errors for missing required fields", () => {
      ManagerPage.quizCreatorDropdown().click();
      ManagerPage.saveQuizButton().click();
      ManagerPage.toastError().should("contain", ValidationErrorMessages.TitleRequired);
      ManagerPage.toastError().should("contain", ValidationErrorMessages.DescriptionRequired);
      ManagerPage.toastError().should("contain", ValidationErrorMessages.AtLeastOneQuestion);
    });

    it("Should show error if radio question created without options", () => {
      ManagerPage.quizCreatorDropdown().click();
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.SingleChoice, false);
      fillQuizFormUI(quiz);
      ManagerPage.saveQuizButton().click();
      ManagerPage.toastError().should("contain", ValidationErrorMessages.AtLeastOneOption);
    });

    it("Should show error if checkbox question created without options", () => {
      ManagerPage.quizCreatorDropdown().click();
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.MultipleChoice, false);
      fillQuizFormUI(quiz);
      ManagerPage.saveQuizButton().click();
      ManagerPage.toastError().should("contain", ValidationErrorMessages.AtLeastOneOption);
    });

    it("Should show error if dropdown question created without options", () => {
      ManagerPage.quizCreatorDropdown().click();
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Dropdown, false);
      fillQuizFormUI(quiz);
      ManagerPage.saveQuizButton().click();
      ManagerPage.toastError().should("contain", ValidationErrorMessages.AtLeastOneOption);
    });

    it("Creates a quiz with all supported question types and options, verifies POST, GET, and UI by ID", () => {
      const quiz = QuizGenerator.generateQuizWithAllTypes();
      cy.intercept("POST", QuizManagerEndpoints.quizzes).as("createQuiz");
      cy.intercept("GET", QuizManagerEndpoints.quizzes).as("getQuizzes");

      ManagerPage.quizCreatorDropdown().click();
      fillQuizFormUI(quiz);
      ManagerPage.saveQuizButton().click();
      ManagerPage.toastPopup().should("contain", QuizSuccessMessages.QuizSaved);

      cy.wait("@createQuiz").then((interception) => {
        const created: QuizResponse = interception.response?.body;
        expect(created.title).to.equal(quiz.title);
        expect(created.description).to.equal(quiz.description);
        expect(created.status).to.equal(QuizStatus.Draft);
        expect(created.questions).to.deep.equal(quiz.questions);
        expect(created.assignedUsers).to.deep.equal(quiz.assignedUsers);

        const quizId = created.id;

        cy.wait("@getQuizzes").then((getIntercept) => {
          const quizzes: QuizResponse[] = getIntercept.response?.body ?? [];
          const quizFromList = quizzes.find((q) => q.id === quizId);
          expect(quizFromList, TestAssertionMessages.QuizShouldExistInGetResponse).to.exist;
          expect(quizFromList?.title).to.equal(quiz.title);
          expect(quizFromList?.description).to.equal(quiz.description);
          expect(quizFromList?.status).to.equal(QuizStatus.Draft);
          expect(quizFromList?.questions).to.deep.equal(quiz.questions);
          expect(quizFromList?.assignedUsers).to.deep.equal(quiz.assignedUsers);

          ManagerPage.quizItemById(quizId).within(() => {
            ManagerPage.quizTitleInItem().should("contain", quiz.title);
            ManagerPage.quizDescriptionInItem().should("contain", quiz.description);
            ManagerPage.statusBadgeWithinItem().should("contain", QuizStatus.Draft);
          });
        });
      });
    });
  });

  context("Quiz assignment", () => {
    it("Manager can assign quiz to all users or custom user", () => {
      cy.intercept("POST", QuizManagerEndpoints.quizzes).as("createQuizAll");

      ManagerPage.quizCreatorDropdown().click();
      const quizAll = QuizGenerator.generateQuizWithOnly(QuestionType.Input);
      fillQuizFormUI(quizAll);

      ManagerPage.saveQuizButton().click();
      cy.wait("@createQuizAll").then(({ request, response }) => {
        expect(request.body.assignedUsers).to.deep.equal([AssignedUsers.All]);
        expect(response?.statusCode).to.eq(200);
        expect(response?.body.assignedUsers).to.deep.equal([AssignedUsers.All]);
      });
      ManagerPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);

      cy.intercept("POST", QuizManagerEndpoints.quizzes).as("createQuizCustom");

      ManagerPage.quizCreatorDropdown().click();
      const quizCustom = QuizGenerator.generateQuizWithOnly(QuestionType.Input);
      fillQuizFormUI(quizCustom);
      ManagerPage.selectAssignMode().select(AssignedUsers.Custom);
      ManagerPage.userCheckboxByEmail(user1.email).check();
      ManagerPage.userCheckboxByEmail(user2.email).check();
      ManagerPage.saveQuizButton().click();

      cy.wait("@createQuizCustom").then(({ request, response }) => {
        expect(request.body.assignedUsers).to.include.members([user1.email, user2.email]);
        expect(request.body.assignedUsers).to.not.include(AssignedUsers.All);
        expect(response?.statusCode).to.eq(200);
        expect(response?.body.assignedUsers).to.include.members([user1.email, user2.email]);
      });
      ManagerPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);
    });
  });
});
