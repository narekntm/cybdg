import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { createAndPublishQuiz, createDraftQuiz, loginViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { QuizRequest, QuizResponse, UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";

describe("Quiz Assignment Rules", () => {
  let manager: UserCredentials;
  let user1: UserCredentials;
  let user2: UserCredentials;
  let quizAll: QuizRequest;
  let quizTargeted: QuizRequest;
  let quizAllId: string;
  let quizTargetedId: string;

  before(() => {
    return TestUserBuilder.createUser(UserRole.Manager)
      .then((m) => (manager = m))
      .then(() => TestUserBuilder.createUser(UserRole.User))
      .then((u1) => (user1 = u1))
      .then(() => TestUserBuilder.createUser(UserRole.User))
      .then((u2) => (user2 = u2));
  });

  beforeEach(() => {
    quizAll = QuizGenerator.generateQuizWithAllTypes();
    quizTargeted = {
      ...QuizGenerator.generateQuizWithAllTypes(),
      assignedUsers: [user1.email],
    };

    return loginViaApi(manager)
      .then(() => createAndPublishQuiz(quizAll))
      .then((id) => {
        quizAllId = id;
        return createAndPublishQuiz(quizTargeted);
      })
      .then((id) => {
        quizTargetedId = id;
      });
  });

  context("Assignment logic for quiz", () => {
    it("Should show quiz for all users", () => {
      return loginViaApi(user1)
        .then(() =>
          cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
            const quizIds = res.body.map((q) => q.id);
            expect(quizIds).to.include(quizAllId);
          })
        )
        .then(() =>
          loginViaApi(user2).then(() =>
            cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
              const quizIds = res.body.map((q) => q.id);
              expect(quizIds).to.include(quizAllId);
            })
          )
        );
    });

    it("Should show quiz only to specified users", () => {
      return loginViaApi(user1)
        .then(() =>
          cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
            const quizIds = res.body.map((q) => q.id);
            expect(quizIds).to.include(quizTargetedId);
          })
        )
        .then(() =>
          loginViaApi(user2).then(() =>
            cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
              const quizIds = res.body.map((q) => q.id);
              expect(quizIds).not.to.include(quizTargetedId);
            })
          )
        );
    });
  });

  context("Edge cases for quiz", () => {
    it("Should NOT show quiz with assignedUsers = [] to any user", () => {
      const quizEmpty: QuizRequest = {
        ...QuizGenerator.generateQuizWithAllTypes(),
        assignedUsers: [],
      };

      return loginViaApi(manager)
        .then(() => createAndPublishQuiz(quizEmpty))
        .then((quizId) =>
          loginViaApi(user1)
            .then(() =>
              cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
                const ids = res.body.map((q) => q.id);
                expect(ids).not.to.include(quizId);
              })
            )
            .then(() =>
              loginViaApi(user2).then(() =>
                cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
                  const ids = res.body.map((q) => q.id);
                  expect(ids).not.to.include(quizId);
                })
              )
            )
        );
    });

    it("Should NOT show inactive quizzes even if user is assigned", () => {
      const draftQuiz: QuizRequest = {
        ...QuizGenerator.generateQuizWithAllTypes(),
        assignedUsers: [user1.email],
      };

      return loginViaApi(manager)
        .then(() => createDraftQuiz(draftQuiz))
        .then((quizId) =>
          loginViaApi(user1).then(() =>
            cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
              const ids = res.body.map((q) => q.id);
              expect(ids).not.to.include(quizId);
            })
          )
        );
    });

    it("Should allow manager to see ALL own quizzes, regardless of status or assignment", () => {
      const quizCustom: QuizRequest = {
        ...QuizGenerator.generateQuizWithAllTypes(),
        assignedUsers: [user2.email],
      };

      return loginViaApi(manager)
        .then(() => createDraftQuiz(quizCustom))
        .then((quizId) =>
          cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
            const ids = res.body.map((q) => q.id);
            expect(ids).to.include(quizId);
          })
        );
    });

    it("Should NOT show quiz to user if status is not active even if assignedUsers = 'all'", () => {
      const quizNotActive: QuizRequest = {
        ...QuizGenerator.generateQuizWithAllTypes(),
        assignedUsers: ["all"],
      };

      return loginViaApi(manager)
        .then(() => createDraftQuiz(quizNotActive))
        .then((quizId) =>
          loginViaApi(user1).then(() =>
            cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
              const ids = res.body.map((q) => q.id);
              expect(ids).not.to.include(quizId);
            })
          )
        );
    });
  });
});
