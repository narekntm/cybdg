import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { createAndPublishQuizUI, loginViaApi, logoutViaApi } from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { frontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { GeneralErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import {
  QuizButtonTexts,
  QuizStatus,
  SubmissionTexts,
  UserCredentials,
  UserRole,
  UserViewTexts,
} from "Models/Arthur/QuizManager/QuizManagerModels";
import { ManagerPage } from "Pages/Arthur/QuizManager/ManagerPage";
import { UserViewPage } from "Pages/Arthur/QuizManager/UserPage";

let manager: UserCredentials;
let user: UserCredentials;

describe("User View Page", () => {
  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((m) => (manager = m));
    TestUserBuilder.createUser(UserRole.User).then((u) => (user = u));
  });

  afterEach(() => {
    logoutViaApi(true);
  });

  it("Should display the logged-in user's id in the header", () => {
    loginViaApi(user);
    cy.visit(frontendRoutes.User);

    UserViewPage.pageTitle().should("be.visible");
    UserViewPage.usernameLabel().should("have.text", user.id);
  });

  it("Should list available quizzes assigned to the user", () => {
    const mockQuizzes = QuizGenerator.generateMockQuizList(3);

    loginViaApi(user);

    cy.intercept("GET", QuizManagerEndpoints.quizzes, {
      statusCode: 200,
      body: mockQuizzes,
    }).as("mockUserQuizzes");

    cy.visit(frontendRoutes.User);

    UserViewPage.availableQuizList().should("be.visible");

    mockQuizzes.forEach((quiz) => {
      UserViewPage.availableQuizItemByTitle(quiz.title).should("exist").and("contain", quiz.description);
    });
  });

  it("Should display quiz count in the header if quizzes are available", () => {
    const mockQuizzes = QuizGenerator.generateMockQuizList(4);

    loginViaApi(user);

    cy.intercept("GET", QuizManagerEndpoints.quizzes, {
      statusCode: 200,
      body: mockQuizzes,
    }).as("mockQuizCount");

    cy.visit(frontendRoutes.User);
    UserViewPage.availableQuizList().find("li").should("have.length", mockQuizzes.length);

    UserViewPage.availableQuizCount()
      .invoke("text")
      .then((text) => {
        const match = text.match(/\d+/);
        expect(match, "Quiz count should be a number").to.not.be.null;
        expect(Number(match[0]), "Quiz count should match list length").to.equal(mockQuizzes.length);
      });
  });

  it('Should open quiz view page when clicking "Submit" on available quiz', () => {
    loginViaApi(manager);
    cy.visit(frontendRoutes.Manager);
    ManagerPage.quizCreatorDropdown().click();

    createAndPublishQuizUI().then((quiz) => {
      ManagerPage.getQuizIdByTitle(quiz.title).then((quizId) => {
        loginViaApi(user);
        cy.visit(frontendRoutes.User);

        UserViewPage.availableQuizItemByTitle(quiz.title).should("exist");

        UserViewPage.openQuizButtonByTitle(quiz.title).click();

        cy.url().should("include", frontendRoutes.QuizView(quizId));
      });
    });
  });

  it("Should show message 'No available quizzes' if none assigned", () => {
    loginViaApi(user);

    cy.intercept("GET", QuizManagerEndpoints.quizzes, {
      statusCode: 200,
      body: [],
    }).as("mockNoQuizzes");

    cy.visit(frontendRoutes.User);

    UserViewPage.availableQuizList().should("contain", UserViewTexts.NoAvailableQuizzes);
  });

  it("Should show message 'No submissions found' if user has none", () => {
    loginViaApi(user);

    cy.intercept("GET", QuizManagerEndpoints.mySubmissions, {
      statusCode: 200,
      body: [],
    }).as("mockEmptySubmissions");

    cy.visit(frontendRoutes.User);

    UserViewPage.submittedQuizList().should("contain", UserViewTexts.NoSubmissions);
  });

  it("Should show submitted quiz title and created date", () => {
    const quizzes = QuizGenerator.generateMockQuizList(1);
    const submissions = QuizGenerator.generateMockSubmissionList(quizzes, user.id);

    loginViaApi(user);

    cy.intercept("GET", QuizManagerEndpoints.quizzes, { body: quizzes });
    cy.intercept("GET", QuizManagerEndpoints.mySubmissions, { body: submissions });
    quizzes.forEach((quiz) => {
      cy.intercept("GET", QuizManagerEndpoints.quiz(quiz.id), {
        statusCode: 200,
        body: quiz,
      });
    });

    cy.visit(frontendRoutes.User);

    UserViewPage.submittedQuizTitleById(submissions[0].id).should("contain", quizzes[0].title);
    UserViewPage.submittedQuizDateById(submissions[0].id).should("contain", SubmissionTexts.CreatedAt);
  });

  it("Should show Edit button if quiz is active, View if archived", () => {
    const quizActive = QuizGenerator.generateMockQuizWithId(`mock-${Date.now()}-active`, QuizStatus.Active);
    const quizArchived = QuizGenerator.generateMockQuizWithId(`mock-${Date.now()}-archived`, QuizStatus.Archived);

    const submissionActive = QuizGenerator.generateMockSubmission(quizActive, user.id, QuizStatus.Active);
    const submissionArchived = QuizGenerator.generateMockSubmission(quizArchived, user.id, QuizStatus.Archived);
    loginViaApi(user);
    cy.intercept("GET", QuizManagerEndpoints.quizzes, {
      body: [quizActive, quizArchived],
    });

    cy.intercept("GET", QuizManagerEndpoints.mySubmissions, {
      body: [submissionActive, submissionArchived],
    });

    [quizActive, quizArchived].forEach((quiz) => {
      cy.intercept("GET", QuizManagerEndpoints.quiz(quiz.id), {
        statusCode: 200,
        body: quiz,
      });
    });

    cy.visit(frontendRoutes.User);

    UserViewPage.editSubmissionButtonById(submissionActive.id).should("contain", QuizButtonTexts.Edit);
    UserViewPage.editSubmissionButtonById(submissionArchived.id).should("contain", QuizButtonTexts.View);
  });

  it("Should handle failure to load available quizzes with toast", () => {
    loginViaApi(user);

    cy.intercept("GET", QuizManagerEndpoints.quizzes, {
      statusCode: 500,
      body: { error: "Server crashed" },
    }).as("mockQuizzesFail");

    cy.visit(frontendRoutes.User);

    UserViewPage.toastError().should("be.visible").should("contain", GeneralErrorMessages.QuizLoadError);
  });
});
