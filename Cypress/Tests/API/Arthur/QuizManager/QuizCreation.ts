import { QuizBuilder } from "Builders/Arthur/QuizManager/QuizBuilder";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { createAndPublishQuiz, createDraftQuiz, loginViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { QuestionType, QuizRequest, QuizStatus, UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";

describe("Quiz Creation Test Scenarios", () => {
  let manager: UserCredentials;
  let user: UserCredentials;
  let quiz: QuizRequest;

  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((m) => (manager = m));
    TestUserBuilder.createUser(UserRole.User).then((u) => (user = u));
  });

  context("Positive cases", () => {
    beforeEach(() => {
      quiz = QuizGenerator.generateQuizWithAllTypes();
      loginViaApi(manager);
    });

    it("Should create quiz with manager credentials", () => {
      createDraftQuiz(quiz).then((quizId) => {
        QuizBuilder.checkQuizDetails(quizId, quiz, manager.id);
      });
    });

    it("Should support all question types in one quiz", () => {
      createDraftQuiz(quiz).then((quizId) => {
        QuizBuilder.checkQuestionTypes(quizId);
      });
    });

    it("Should return created quiz in the list", () => {
      createAndPublishQuiz(quiz).then((quizId) => {
        QuizBuilder.checkQuizExistsInList(quizId);
      });
    });

    it("Should publish quiz and set status to 'active'", () => {
      createAndPublishQuiz(quiz).then((quizId) => {
        QuizBuilder.checkStatus(quizId, QuizStatus.Active);
      });
    });

    it("Should archive quiz and set status to 'archived'", () => {
      createAndPublishQuiz(quiz).then((quizId) => {
        QuizBuilder.archiveQuiz(quizId);
        QuizBuilder.checkStatus(quizId, QuizStatus.Archived);
      });
    });

    it("Should assign ['all'] if assignedUsers is not provided", () => {
      const quiz = QuizGenerator.generateQuizWithAllTypes();
      delete quiz.assignedUsers;

      createDraftQuiz(quiz).then((quizId) => {
        QuizBuilder.checkAssignedAllByDefault(quizId);
      });
    });

    it("Should NOT allow other managers to see a quiz they didn't create", () => {
      TestUserBuilder.createUser(UserRole.Manager).then((managerA) => {
        TestUserBuilder.createUser(UserRole.Manager).then((managerB) => {
          const quiz = QuizGenerator.generateQuizWithAllTypes();
          loginViaApi(managerA);
          createDraftQuiz(quiz).then((quizId) => {
            loginViaApi(managerB);
            QuizBuilder.checkNotVisibleToOtherManager(quizId, false);
          });
        });
      });
    });
  });

  context("Negative cases", () => {
    beforeEach(() => {
      loginViaApi(manager);
    });

    it("Should not allow User to create quiz", () => {
      loginViaApi(user);
      const quiz = QuizGenerator.generateQuizWithAllTypes();
      QuizBuilder.check403(QuizManagerEndpoints.quizzes, "POST", quiz, false);
    });

    it("Should not allow User to publish quiz", () => {
      loginViaApi(user);
      QuizBuilder.check403(QuizManagerEndpoints.quizPublish("not-existing-id"), "PATCH", undefined, false);
    });

    it("Should not allow User to archive quiz", () => {
      loginViaApi(user);
      QuizBuilder.check403(QuizManagerEndpoints.quizArchive("not-existing-id"), "PATCH", undefined, false);
    });

    it("Should not allow User to delete quiz", () => {
      loginViaApi(user);
      QuizBuilder.check403(QuizManagerEndpoints.quiz("some-id"), "DELETE", undefined, false);
    });

    it("Should return 404 when publishing not-existing quiz", () => {
      QuizBuilder.check404(QuizManagerEndpoints.quizPublish("not-existing-id"), false);
    });

    it("Should return 404 when archiving not-existing quiz", () => {
      QuizBuilder.check404(QuizManagerEndpoints.quizArchive("not-existing-id"), false);
    });

    it("Should return 400 when deleting quiz with submissions", () => {
      const quiz = QuizGenerator.generateQuizWithAllTypes();
      createAndPublishQuiz(quiz).then((quizId) => {
        loginViaApi(user);
        const answers = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? "Some answer" : [q.options[0] || "fallback"],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers });
        loginViaApi(manager);
        QuizBuilder.checkDeleteWithSubmissionsBlocked(quizId, false);
      });
    });
  });
});
