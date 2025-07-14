import { QuizBuilder, UserBuilder } from "Builders/Arthur/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { loginViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { QuizRequest, QuizResponse, UserCredentials } from "Models/Arthur/QuizManager/QuizManagerModels";

describe("Quiz Assignment Rules", () => {
  let admin: UserCredentials;
  let user1: UserCredentials;
  let user2: UserCredentials;
  let quizAll: QuizRequest;
  let quizTargeted: QuizRequest;
  let quizAllId: string;
  let quizTargetedId: string;

  before(() => {
    admin = UserBuilder.validAdmin();
    user1 = UserBuilder.validUser();
    user2 = UserBuilder.anotherValidUser();

    quizAll = QuizBuilder.generateValidQuiz();

    quizTargeted = {
      ...QuizBuilder.generateValidQuiz(),
      assignedUsers: [user1.email],
    };

    loginViaApi(admin).then(() => {
      cy.request<QuizResponse>("POST", QuizManagerEndpoints.quizzes, quizAll).then((res) => {
        quizAllId = res.body.id;
        cy.request("PATCH", QuizManagerEndpoints.quizPublish(quizAllId));
      });

      cy.request<QuizResponse>("POST", QuizManagerEndpoints.quizzes, quizTargeted).then((res) => {
        quizTargetedId = res.body.id;
        cy.request("PATCH", QuizManagerEndpoints.quizPublish(quizTargetedId));
      });
    });
  });

  context("Assignment logic for quiz", () => {
    it("Should show quiz for all users", () => {
      loginViaApi(user1).then(() => {
        cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
          const quizIds = res.body.map((q) => q.id);
          expect(quizIds).to.include(quizAllId);
        });
      });

      loginViaApi(user2).then(() => {
        cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
          const quizIds = res.body.map((q) => q.id);
          expect(quizIds).to.include(quizAllId);
        });
      });
    });

    it("Should show quiz only to specified users", () => {
      loginViaApi(user1).then(() => {
        cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
          const quizIds = res.body.map((q) => q.id);
          expect(quizIds).to.include(quizTargetedId);
        });
      });

      loginViaApi(user2).then(() => {
        cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
          const quizIds = res.body.map((q) => q.id);
          expect(quizIds).not.to.include(quizTargetedId);
        });
      });
    });

    it("Should not show quiz to unassigned users", () => {
      loginViaApi(user2).then(() => {
        cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
          const quizIds = res.body.map((q) => q.id);
          expect(quizIds).not.to.include(quizTargetedId);
        });
      });
    });
  });

  context("Edge cases for quiz", () => {
    it("Should NOT show quiz with assignedUsers = [] to any user", () => {
      const quizEmpty: QuizRequest = {
        ...QuizBuilder.generateValidQuiz(),
        assignedUsers: [],
      };

      loginViaApi(admin).then(() => {
        cy.request("POST", QuizManagerEndpoints.quizzes, quizEmpty).then((res) => {
          const quizId = res.body.id;
          cy.request("PATCH", QuizManagerEndpoints.quizPublish(quizId)).then(() => {
            loginViaApi(user1).then(() => {
              cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
                const ids = res.body.map((q) => q.id);
                expect(ids).not.to.include(quizId);
              });
            });

            loginViaApi(user2).then(() => {
              cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
                const ids = res.body.map((q) => q.id);
                expect(ids).not.to.include(quizId);
              });
            });
          });
        });
      });
    });

    it("Should NOT show inactive quizzes even if user is assigned", () => {
      const draftQuiz: QuizRequest = {
        ...QuizBuilder.generateValidQuiz(),
        assignedUsers: [user1.email],
      };

      loginViaApi(admin).then(() => {
        cy.request("POST", QuizManagerEndpoints.quizzes, draftQuiz).then((res) => {
          const draftQuizId = res.body.id;

          loginViaApi(user1).then(() => {
            cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
              const ids = res.body.map((q) => q.id);
              expect(ids).not.to.include(draftQuizId);
            });
          });
        });
      });
    });

    it("Should allow Admin to see ALL own quizzes, regardless of status or assignment", () => {
      const quizCustom: QuizRequest = {
        ...QuizBuilder.generateValidQuiz(),
        assignedUsers: [user2.email],
      };

      loginViaApi(admin).then(() => {
        cy.request("POST", QuizManagerEndpoints.quizzes, quizCustom).then((res) => {
          const ownQuizId = res.body.id;

          cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
            const ids = res.body.map((q) => q.id);
            expect(ids).to.include(ownQuizId);
          });
        });
      });
    });

    it("Should NOT show quiz to user if status is not active even if assignedUsers = 'all'", () => {
      const quizNotActive: QuizRequest = {
        ...QuizBuilder.generateValidQuiz(),
        assignedUsers: "all",
      };

      loginViaApi(admin).then(() => {
        cy.request("POST", QuizManagerEndpoints.quizzes, quizNotActive).then((res) => {
          const quizId = res.body.id;

          loginViaApi(user1).then(() => {
            cy.request<QuizResponse[]>(QuizManagerEndpoints.quizzes).then((res) => {
              const ids = res.body.map((q) => q.id);
              expect(ids).not.to.include(quizId);
            });
          });
        });
      });
    });
  });
});
