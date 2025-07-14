import { QuizBuilder, UserBuilder } from "Builders/Arthur/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { loginViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { QuizErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import {
  AssignedUsers,
  Question,
  QuestionType,
  QuizFields,
  QuizRequest,
  QuizResponse,
  QuizStatus,
  TestUserIds,
  UserCredentials,
} from "Models/Arthur/QuizManager/QuizManagerModels";

describe("Quiz Creation Test Scenarios", () => {
  let admin: UserCredentials;
  let quiz: QuizRequest;

  context("Positive cases", () => {
    beforeEach(() => {
      admin = UserBuilder.validAdmin();
      quiz = QuizBuilder.generateValidQuiz();
      loginViaApi(admin);
    });

    it("Should create quiz with admin credentials", () => {
      cy.request("POST", QuizManagerEndpoints.quizzes, quiz).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.all.keys(
          QuizFields.Id,
          QuizFields.Title,
          QuizFields.Description,
          QuizFields.AssignedUsers,
          QuizFields.Questions,
          QuizFields.Status,
          QuizFields.CreatedBy
        );
        expect(res.body.title).to.eq(quiz.title);
        expect(res.body.description).to.eq(quiz.description);
        expect(res.body.status).to.eq(QuizStatus.Draft);
        expect(res.body.questions).to.have.length(quiz.questions.length);
        expect(res.body.assignedUsers).to.eq(AssignedUsers.All);
        expect(res.body.createdBy).to.eq(TestUserIds.Admin);
      });
    });

    it("Should support all question types in one quiz", () => {
      cy.request("POST", QuizManagerEndpoints.quizzes, quiz).then((res) => {
        const questions = res.body.questions as Question[];
        const types = questions.map((q) => q.type);

        expect(types).to.include.members([
          QuestionType.Input,
          QuestionType.SingleChoice,
          QuestionType.MultipleChoice,
          QuestionType.Dropdown,
        ]);
      });
    });

    it("Should return created quiz in the list", () => {
      cy.request("POST", QuizManagerEndpoints.quizzes, quiz).then((createRes) => {
        const quizId = createRes.body.id;

        cy.request("GET", QuizManagerEndpoints.quizzes).then((res) => {
          const quizzes = res.body as QuizResponse[];
          const ids = quizzes.map((q) => q.id);
          expect(ids).to.include(quizId);
        });
      });
    });

    it("Should publish quiz and set status to 'active'", () => {
      cy.request("POST", QuizManagerEndpoints.quizzes, quiz).then((createRes) => {
        const quizId = createRes.body.id;

        cy.request("PATCH", QuizManagerEndpoints.quizPublish(quizId)).then((publishRes) => {
          expect(publishRes.status).to.eq(200);

          cy.request(QuizManagerEndpoints.quiz(quizId)).then((getRes) => {
            expect(getRes.body.status).to.eq(QuizStatus.Active);
          });
        });
      });
    });

    it("Should archive quiz and set status to 'archived'", () => {
      cy.request("POST", QuizManagerEndpoints.quizzes, quiz).then((createRes) => {
        const quizId = createRes.body.id;

        cy.request("PATCH", QuizManagerEndpoints.quizArchive(quizId)).then((archiveRes) => {
          expect(archiveRes.status).to.eq(200);

          cy.request(QuizManagerEndpoints.quiz(quizId)).then((getRes) => {
            expect(getRes.body.status).to.eq(QuizStatus.Archived);
          });
        });
      });
    });
  });

  context("Negative cases", () => {
    it("Should not allow User to create quiz", () => {
      const user = UserBuilder.validUser();
      const quiz = QuizBuilder.generateValidQuiz();

      loginViaApi(user).then(() => {
        cy.request({
          method: "POST",
          url: QuizManagerEndpoints.quizzes,
          body: quiz,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(403);
        });
      });
    });

    it("Should not allow User to publish quiz", () => {
      const user = UserBuilder.validUser();
      const fakeQuizId = "not-existing-id";

      loginViaApi(user).then(() => {
        cy.request({
          method: "PATCH",
          url: QuizManagerEndpoints.quizPublish(fakeQuizId),
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(403);
        });
      });
    });

    it("Should not allow User to archive quiz", () => {
      const user = UserBuilder.validUser();
      const fakeQuizId = "not-existing-id";

      loginViaApi(user).then(() => {
        cy.request({
          method: "PATCH",
          url: QuizManagerEndpoints.quizArchive(fakeQuizId),
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(403);
        });
      });
    });

    it("Should not allow User to delete quiz", () => {
      const user = UserBuilder.validUser();
      const quizId = "some-id";

      loginViaApi(user).then(() => {
        cy.request({
          method: "DELETE",
          url: QuizManagerEndpoints.quiz(quizId),
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(403);
        });
      });
    });

    it("Should return 404 when publishing not-existing quiz", () => {
      const admin = UserBuilder.validAdmin();
      const fakeId = "not-existing-id";

      loginViaApi(admin).then(() => {
        cy.request({
          method: "PATCH",
          url: QuizManagerEndpoints.quizPublish(fakeId),
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(404);
          expect(res.body.error).to.include(QuizErrorMessages.QuizNotFound);
        });
      });
    });

    it("Should return 404 when archiving not-existing quiz", () => {
      const admin = UserBuilder.validAdmin();
      const fakeId = "not-existing-id";

      loginViaApi(admin).then(() => {
        cy.request({
          method: "PATCH",
          url: QuizManagerEndpoints.quizArchive(fakeId),
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(404);
          expect(res.body.error).to.include(QuizErrorMessages.QuizNotFound);
        });
      });
    });

    it("Should return 400 when deleting quiz with submissions", () => {
      const admin = UserBuilder.validAdmin();
      const user = UserBuilder.validUser();
      const quiz = QuizBuilder.generateValidQuiz();

      loginViaApi(admin).then(() => {
        cy.request("POST", QuizManagerEndpoints.quizzes, quiz).then((createRes) => {
          const quizId = createRes.body.id;

          cy.request("PATCH", QuizManagerEndpoints.quizPublish(quizId)).then(() => {
            loginViaApi(user).then(() => {
              const answers = quiz.questions.map((q) => ({
                questionId: q.id,
                answer: q.type === QuestionType.Input ? "Some answer" : [q.options[0] || "fallback"],
              }));

              cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), {
                answers,
              }).then(() => {
                loginViaApi(admin).then(() => {
                  cy.request({
                    method: "DELETE",
                    url: QuizManagerEndpoints.quiz(quizId),
                    failOnStatusCode: false,
                  }).then((res) => {
                    expect(res.status).to.eq(400);
                    expect(res.body.error).to.include(QuizErrorMessages.QuizHasSubmissions);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
