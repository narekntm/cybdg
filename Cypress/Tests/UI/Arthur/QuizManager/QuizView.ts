import { Chance } from "chance";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { loginViaApi, logoutViaApi } from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { FrontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { QuizStatus, UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";
import { QuizViewPage } from "Pages/Arthur/QuizManager/QuizView";

const chance = new Chance();
let user: UserCredentials;

describe("Quiz View Page", () => {
  before(() => {
    TestUserBuilder.createUser(UserRole.User).then((u) => (user = u));
  });

  afterEach(() => {
    logoutViaApi();
  });

  it("Should display quiz title and description", () => {
    const mockQuizId = `mock-view-${Date.now()}`;
    const mockQuiz = QuizGenerator.generateMockQuizWithId(mockQuizId, QuizStatus.Active);

    loginViaApi(user);

    cy.intercept("GET", QuizManagerEndpoints.quiz(mockQuizId), {
      statusCode: 200,
      body: mockQuiz,
    }).as("mockQuiz");

    cy.visit(FrontendRoutes.QuizView(mockQuizId));
    cy.wait("@mockQuiz");

    QuizViewPage.quizTitle().should("have.text", mockQuiz.title);
    QuizViewPage.quizDescription().should("have.text", mockQuiz.description);
  });

  it("Should show all question types properly", () => {
    const mockQuizId = `mock-view-all-types-${Date.now()}`;
    const mockQuiz = QuizGenerator.generateMockQuizWithAllTypesAndId(mockQuizId, QuizStatus.Active);

    loginViaApi(user);

    cy.intercept("GET", QuizManagerEndpoints.quiz(mockQuizId), {
      statusCode: 200,
      body: mockQuiz,
    }).as("mockQuiz");

    cy.visit(FrontendRoutes.QuizView(mockQuizId));
    cy.wait("@mockQuiz");

    QuizViewPage.inputByLabel(mockQuiz.questions[0].label).should("exist");

    const radio = mockQuiz.questions[1];
    QuizViewPage.radioByLabel(radio.label, radio.options[0]).should("exist");

    const checkbox = mockQuiz.questions[2];
    QuizViewPage.checkboxByLabel(checkbox.label, checkbox.options[0]).should("exist");

    const dropdown = mockQuiz.questions[3];
    QuizViewPage.selectByLabel(dropdown.label).should("exist");
  });

  it("Should allow user to submit answers to active quiz", () => {
    const mockQuizId = `mock-submit-${Date.now()}`;
    const mockQuiz = QuizGenerator.generateMockQuizWithAllTypesAndId(mockQuizId, QuizStatus.Active);

    loginViaApi(user);

    cy.intercept("GET", QuizManagerEndpoints.quiz(mockQuizId), {
      statusCode: 200,
      body: mockQuiz,
    }).as("mockQuiz");

    cy.intercept("POST", QuizManagerEndpoints.submitToQuiz(mockQuizId), {
      statusCode: 200,
      body: { success: true },
    }).as("submitQuiz");

    cy.visit(FrontendRoutes.QuizView(mockQuizId));
    cy.wait("@mockQuiz");

    QuizViewPage.inputByLabel(mockQuiz.questions[0].label).type(chance.sentence());

    const radio = mockQuiz.questions[1];
    QuizViewPage.radioByLabel(radio.label, radio.options[0]).check();

    const checkbox = mockQuiz.questions[2];
    QuizViewPage.checkboxByLabel(checkbox.label, checkbox.options[0]).check();

    const dropdown = mockQuiz.questions[3];
    QuizViewPage.selectDropdown(dropdown.label, dropdown.options[0]);

    QuizViewPage.submitButton().click();

    cy.wait("@submitQuiz");
    cy.url().should("include", FrontendRoutes.User);
  });
});
