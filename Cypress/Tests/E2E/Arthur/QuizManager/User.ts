import Chance from "chance";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { frontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { fillQuizFormUI, loginViaApi, logoutViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import {
  AssignedUsers,
  QuestionType,
  QuizStatus,
  Submission,
  UserCredentials,
  UserRole,
} from "Models/Arthur/QuizManager/QuizManagerModels";
import { ManagerPage } from "Pages/Arthur/QuizManager/ManagerPage";
import { QuizViewPage } from "Pages/Arthur/QuizManager/QuizView";
import { UserViewPage } from "Pages/Arthur/QuizManager/UserPage";
import { QuizSubmissionsPage } from "Pages/Arthur/QuizManager/ViewSumbmissionsPage";

const chance = new Chance();

describe("E2E - Full Quiz Assignment, Submission and Verification Flow", () => {
  let manager: UserCredentials;
  let user: UserCredentials;

  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((u) => (manager = u));
    TestUserBuilder.createUser(UserRole.User).then((u) => (user = u));
  });

  it("Should allow manager to assign quiz to a user, user to submit, and manager to verify submission", () => {
    loginViaApi(manager);
    cy.visit(frontendRoutes.Manager);

    cy.intercept("POST", QuizManagerEndpoints.quizzes).as("createQuiz");

    ManagerPage.quizCreatorDropdown().click();

    const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Input);
    quiz.assignedUsers = [user.email];
    const quizTitle = quiz.title;
    const quizQuestionLabel = quiz.questions[0].label;
    fillQuizFormUI(quiz);

    ManagerPage.selectAssignMode().select(AssignedUsers.Custom);
    ManagerPage.userCheckboxByEmail(user.email).check();
    ManagerPage.saveQuizButton().click();

    cy.wait("@createQuiz").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      const quizId = response?.body?.id as string;
      expect(quizId, "Quiz ID from API").to.be.a("string").and.not.be.empty;

      cy.intercept("PATCH", QuizManagerEndpoints.quizPublish(quizId)).as("publishQuiz");
      ManagerPage.quizItemByTitle(quizTitle).within(() => {
        ManagerPage.publishButtonWithin().click();
      });

      cy.wait("@publishQuiz").its("response.statusCode").should("eq", 200);

      ManagerPage.quizItemByTitle(quizTitle).within(() => {
        ManagerPage.statusBadgeWithinItem().should("contain", QuizStatus.Active);
      });

      logoutViaApi();
      loginViaApi(user);
      cy.visit(frontendRoutes.User);

      UserViewPage.availableQuizTitleByText(quizTitle).should("exist");
      UserViewPage.openQuizButtonByTitle(quizTitle).click();

      const answerText = chance.sentence({ words: 3 });
      QuizViewPage.inputByLabel(quizQuestionLabel).type(answerText);

      cy.intercept("POST", QuizManagerEndpoints.submitToQuiz(quizId)).as("submitQuiz");
      QuizViewPage.submitButton().click();

      cy.wait("@submitQuiz").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(response?.body.answers[quiz.questions[0].id]).to.eq(answerText);
      });

      cy.visit(frontendRoutes.User);
      UserViewPage.submittedQuizList().should("contain", quizTitle);

      logoutViaApi();
      loginViaApi(manager);
      cy.visit(frontendRoutes.Manager);

      cy.intercept("GET", QuizManagerEndpoints.quizSubmissions(quizId)).as("getSubmissions");

      ManagerPage.getQuizIdByTitle(quizTitle).then((uiQuizId) => {
        ManagerPage.viewSubmissionsByQuizId(uiQuizId).click();
      });

      cy.wait("@getSubmissions").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        const submissions = response?.body as Submission[];
        expect(Array.isArray(submissions)).to.be.true;
        expect(submissions.some((s) => s.quizId === quizId)).to.be.true;
      });

      QuizSubmissionsPage.submissionUser(0).should("contain", user.id);
      QuizSubmissionsPage.answerValue(quizQuestionLabel).invoke("text").should("contain", answerText);
    });
  });
});
