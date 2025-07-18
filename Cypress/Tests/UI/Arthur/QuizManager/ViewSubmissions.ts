import Chance from "chance";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { createAndPublishQuiz, loginViaApi, logoutViaApi } from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { frontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { GeneralErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import { Country, Gender, QuizRequest, SubmissionTexts, Technology, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";
import { QuizViewPage } from "Pages/Arthur/QuizManager/QuizView";
import { QuizSubmissionsPage } from "Pages/Arthur/QuizManager/ViewSumbmissionsPage";

const chance = new Chance();

let quizId = "";
let submissionId = "";
let userName = "";
let quiz: QuizRequest;
let user: { id: string; email: string; password: string; role: UserRole };
let manager: { id: string; email: string; password: string; role: UserRole };

before(() => {
  TestUserBuilder.createUser(UserRole.Manager).then((m) => (manager = m));
  TestUserBuilder.createUser(UserRole.User).then((u) => (user = u));

  cy.then(() => {
    quiz = QuizGenerator.generateQuizWithAllTypes();
    loginViaApi(manager);
    createAndPublishQuiz(quiz).then((id) => {
      quizId = id;
    });
  });
});

describe("Quiz Submissions Page", () => {
  context("Setup: Submit quiz", () => {
    it("Should submit quiz via UI", () => {
      loginViaApi(user);
      cy.visit(frontendRoutes.QuizView(quizId));

      userName = chance.name();
      QuizViewPage.inputByLabel(quiz.questions[0].label).type(userName);
      QuizViewPage.radioByLabel(quiz.questions[1].label, Gender.Male).check({ force: true });
      QuizViewPage.checkboxByLabel(quiz.questions[2].label, Technology.JavaScript).check({ force: true });
      QuizViewPage.checkboxByLabel(quiz.questions[2].label, Technology.Python).check({ force: true });
      QuizViewPage.selectDropdown(quiz.questions[3].label, Country.USA);

      cy.intercept("POST", QuizManagerEndpoints.quizSubmissions(quizId)).as("submitQuiz");
      QuizViewPage.submitButton().click();

      cy.wait("@submitQuiz").then((interception) => {
        submissionId = interception.response?.body.id;
        expect(submissionId, "submission ID should exist").to.exist;
      });

      cy.url().should("include", frontendRoutes.User);
    });
  });

  context("Positive Scenarios", () => {
    beforeEach(() => {
      loginViaApi(manager);
      cy.visit(frontendRoutes.ViewSubmissions(quizId));
    });

    it("Should show quiz title, description and total submission count", () => {
      const expectedSubmissionCount = 1;
      QuizSubmissionsPage.quizTitle().should("contain", quiz.title);
      QuizSubmissionsPage.quizDescription().should("contain", quiz.description);
      QuizSubmissionsPage.totalSubmissionsText().should("contain", SubmissionTexts.TotalSubmissions);
      QuizSubmissionsPage.totalSubmissionsValue().should("contain", expectedSubmissionCount.toString());
      QuizSubmissionsPage.submissionCards().should("have.length", expectedSubmissionCount);
      QuizSubmissionsPage.submissionUser(0).should("contain", user.id);
    });

    it("Should render submission card with user ID and timestamp", () => {
      QuizSubmissionsPage.submissionCards().should("have.length", 1);
      QuizSubmissionsPage.submissionUser(0).should("contain", user.id);
      QuizSubmissionsPage.submissionTimestamp(0).should("contain", SubmissionTexts.CreatedAt);
    });

    it("Should show submitted answers when specific submission is clicked", () => {
      QuizSubmissionsPage.submissionCardById(submissionId).click();
      QuizSubmissionsPage.submissionAnswersById(submissionId)
        .should("be.visible")
        .within(() => {
          QuizSubmissionsPage.answerValue(quiz.questions[0].label).should("contain", userName);
          QuizSubmissionsPage.answerValue(quiz.questions[1].label).should("contain", Gender.Male);
          QuizSubmissionsPage.answerValue(quiz.questions[2].label)
            .should("contain", Technology.JavaScript)
            .and("contain", Technology.Python);
          QuizSubmissionsPage.answerValue(quiz.questions[3].label).should("contain", Country.USA);
        });
    });
  });

  context("Negative Scenarios", () => {
    it("Should show error for invalid quiz ID", () => {
      loginViaApi(manager);
      const invalidQuizId = chance.guid();
      cy.visit(frontendRoutes.ViewSubmissions(invalidQuizId));
      QuizSubmissionsPage.errorText().should("exist");
      QuizSubmissionsPage.errorText().invoke("text").should("include", GeneralErrorMessages.NotFound);
    });

    it("Should redirect user (non-manager) to login", () => {
      loginViaApi(user);
      cy.visit(frontendRoutes.ViewSubmissions(quizId));
      QuizSubmissionsPage.errorText().should("contain", GeneralErrorMessages.Forbidden);
    });
  });
});

afterEach(() => {
  logoutViaApi(true);
});
