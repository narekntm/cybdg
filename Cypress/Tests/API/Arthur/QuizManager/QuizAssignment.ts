import { QuizBuilder } from "Builders/Arthur/QuizManager/QuizBuilder";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { createAndPublishQuiz, createDraftQuiz, loginViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { QuizRequest, UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";

describe("Quiz Assignment Rules", () => {
  let manager: UserCredentials;
  let user1: UserCredentials;
  let user2: UserCredentials;
  let quizAll: QuizRequest;
  let quizTargeted: QuizRequest;
  let quizAllId: string;
  let quizTargetedId: string;

  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((m) => (manager = m));
    TestUserBuilder.createUser(UserRole.User).then((u1) => (user1 = u1));
    TestUserBuilder.createUser(UserRole.User).then((u2) => (user2 = u2));
  });

  beforeEach(() => {
    quizAll = QuizGenerator.generateQuizWithAllTypes();
    quizTargeted = {
      ...QuizGenerator.generateQuizWithAllTypes(),
      assignedUsers: [user1.email],
    };

    loginViaApi(manager);
    createAndPublishQuiz(quizAll).then((id) => (quizAllId = id));
    createAndPublishQuiz(quizTargeted).then((id) => (quizTargetedId = id));
  });

  context("Assignment logic for quiz", () => {
    it("Should show quiz for all users", () => {
      loginViaApi(user1);
      QuizBuilder.checkQuizVisible(quizAllId);

      loginViaApi(user2);
      QuizBuilder.checkQuizVisible(quizAllId);
    });

    it("Should show quiz only to specified users", () => {
      loginViaApi(user1);
      QuizBuilder.checkQuizVisible(quizTargetedId);

      loginViaApi(user2);
      QuizBuilder.checkQuizHidden(quizTargetedId, false);
    });
  });

  context("Edge cases for quiz", () => {
    it("Should NOT show quiz with assignedUsers = [] to any user", () => {
      const quizEmpty: QuizRequest = {
        ...QuizGenerator.generateQuizWithAllTypes(),
        assignedUsers: [],
      };

      loginViaApi(manager);
      createAndPublishQuiz(quizEmpty).then((quizId) => {
        loginViaApi(user1);
        QuizBuilder.checkQuizHidden(quizId, false);

        loginViaApi(user2);
        QuizBuilder.checkQuizHidden(quizId, false);
      });
    });

    it("Should NOT show inactive quizzes even if user is assigned", () => {
      const draftQuiz: QuizRequest = {
        ...QuizGenerator.generateQuizWithAllTypes(),
        assignedUsers: [user1.email],
      };

      loginViaApi(manager);
      createDraftQuiz(draftQuiz).then((quizId) => {
        loginViaApi(user1);
        QuizBuilder.checkQuizHidden(quizId, false);
      });
    });

    it("Should allow manager to see ALL own quizzes, regardless of status or assignment", () => {
      const quizCustom: QuizRequest = {
        ...QuizGenerator.generateQuizWithAllTypes(),
        assignedUsers: [user2.email],
      };

      loginViaApi(manager);
      createDraftQuiz(quizCustom).then((quizId) => {
        QuizBuilder.checkQuizVisible(quizId);
      });
    });

    it("Should NOT show quiz to user if status is not active even if assignedUsers = 'all'", () => {
      const quizNotActive: QuizRequest = {
        ...QuizGenerator.generateQuizWithAllTypes(),
        assignedUsers: ["all"],
      };

      loginViaApi(manager);
      createDraftQuiz(quizNotActive).then((quizId) => {
        loginViaApi(user1);
        QuizBuilder.checkQuizHidden(quizId, false);
      });
    });
  });
});
