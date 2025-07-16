import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { loginViaApi, logoutViaApi } from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { frontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { QuizStatus, QuizSuccessMessages, UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";
import { ManagerPage as AdminPage } from "Pages/Arthur/QuizManager/ManagerPage";

let manager: UserCredentials;
//let user: UserCredentials;

describe("Admin Dashboard UI", () => {
  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((cred) => {
      manager = cred;
    });
    // TestUserBuilder.createUser(UserRole.User).then((cred) => {
    //   user = cred;
    // });
  });

  beforeEach(() => {
    loginViaApi(manager);
    cy.visit(frontendRoutes.Manager);
  });

  afterEach(() => {
    logoutViaApi(false);
  });

  context("Positive Cases", () => {
    it("Should create a new quiz with 4 question types and assign to all", () => {
      const quiz = QuizGenerator.generateQuizWithAllTypes();

      AdminPage.quizTitleInput().type(quiz.title);
      AdminPage.quizDescriptionInput().type(quiz.description);

      quiz.questions.forEach((q, index) => {
        AdminPage.addQuestionButton().click();
        AdminPage.questionTextInputs().eq(index).type(q.label);
        AdminPage.questionTypeSelects().eq(index).select(q.type);
        if (q.options.length) {
          AdminPage.commaSeparatedInputs().eq(index).type(q.options.join(", "));
        }
      });

      AdminPage.selectAssignMode().select("all");
      AdminPage.saveQuizButton().click();

      cy.get(".toast.success").should("contain", QuizSuccessMessages.QuizSaved);
      AdminPage.quizTitles().should("contain", quiz.title);
      AdminPage.quizItemByTitle(quiz.title).within(() => {
        AdminPage.statusBadgeWithinItem().should("contain", QuizStatus.Draft);
      });
    });
  });
});
