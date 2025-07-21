import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { createAndPublishQuiz, createDraftQuiz, loginViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { QuizErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import {
  AssignedUsers,
  Question,
  QuestionType,
  QuizFields,
  QuizRequest,
  QuizResponse,
  QuizStatus,
  UserCredentials,
  UserRole,
} from "Models/Arthur/QuizManager/QuizManagerModels";

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
        cy.request(QuizManagerEndpoints.quiz(quizId)).then((res) => {
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
          expect(res.body.assignedUsers).to.deep.eq([AssignedUsers.All]);
          expect(res.body.createdBy).to.eq(manager.id);
        });
      });
    });

    it("Should support all question types in one quiz", () => {
      createDraftQuiz(quiz).then((quizId) => {
        cy.request(QuizManagerEndpoints.quiz(quizId)).then((res) => {
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
    });

    it("Should return created quiz in the list", () => {
      createAndPublishQuiz(quiz).then((quizId) => {
        cy.request("GET", QuizManagerEndpoints.quizzes).then((res) => {
          const quizzes = res.body as QuizResponse[];
          const ids = quizzes.map((q) => q.id);
          expect(ids).to.include(quizId);
        });
      });
    });

    it("Should publish quiz and set status to 'active'", () => {
      createAndPublishQuiz(quiz).then((quizId) => {
        cy.request(QuizManagerEndpoints.quiz(quizId)).its("body.status").should("eq", QuizStatus.Active);
      });
    });

    it("Should archive quiz and set status to 'archived'", () => {
      createAndPublishQuiz(quiz).then((quizId) => {
        cy.request("PATCH", QuizManagerEndpoints.quizArchive(quizId)).its("status").should("eq", 200);
        cy.request(QuizManagerEndpoints.quiz(quizId)).its("body.status").should("eq", QuizStatus.Archived);
      });
    });

    it("Should assign ['all'] if assignedUsers is not provided", () => {
      const quiz = QuizGenerator.generateQuizWithAllTypes();
      delete quiz.assignedUsers;

      createDraftQuiz(quiz).then((quizId) => {
        cy.request(QuizManagerEndpoints.quiz(quizId)).its("body.assignedUsers").should("deep.eq", [AssignedUsers.All]);
      });
    });

    it("Should NOT allow other managers to see a quiz they didn't create", () => {
      let quizId: string;

      TestUserBuilder.createUser(UserRole.Manager).then((managerA) => {
        TestUserBuilder.createUser(UserRole.Manager).then((managerB) => {
          const quiz = QuizGenerator.generateQuizWithAllTypes();
          loginViaApi(managerA);
          createDraftQuiz(quiz).then((id) => {
            quizId = id;
            loginViaApi(managerB);
            cy.request(QuizManagerEndpoints.quizzes).then((res) => {
              const quizIds = (res.body as QuizResponse[]).map((q) => q.id);
              expect(quizIds).not.to.include(quizId);
            });
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

      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.quizzes,
        body: quiz,
        failOnStatusCode: false,
      })
        .its("status")
        .should("eq", 403);
    });

    it("Should not allow User to publish quiz", () => {
      loginViaApi(user);

      cy.request({
        method: "PATCH",
        url: QuizManagerEndpoints.quizPublish("not-existing-id"),
        failOnStatusCode: false,
      })
        .its("status")
        .should("eq", 403);
    });

    it("Should not allow User to archive quiz", () => {
      loginViaApi(user);

      cy.request({
        method: "PATCH",
        url: QuizManagerEndpoints.quizArchive("not-existing-id"),
        failOnStatusCode: false,
      })
        .its("status")
        .should("eq", 403);
    });

    it("Should not allow User to delete quiz", () => {
      loginViaApi(user);

      cy.request({
        method: "DELETE",
        url: QuizManagerEndpoints.quiz("some-id"),
        failOnStatusCode: false,
      })
        .its("status")
        .should("eq", 403);
    });

    it("Should return 404 when publishing not-existing quiz", () => {
      cy.request({
        method: "PATCH",
        url: QuizManagerEndpoints.quizPublish("not-existing-id"),
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.error).to.include(QuizErrorMessages.QuizNotFound);
      });
    });

    it("Should return 404 when archiving not-existing quiz", () => {
      cy.request({
        method: "PATCH",
        url: QuizManagerEndpoints.quizArchive("not-existing-id"),
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.error).to.include(QuizErrorMessages.QuizNotFound);
      });
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
