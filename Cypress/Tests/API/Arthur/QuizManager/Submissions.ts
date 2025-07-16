import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import {
  loginViaApi,
  createAndPublishQuiz,
} from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import {
  AuthErrorMessages,
  QuizErrorMessages,
  SubmissionErrorMessages,
} from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import {
  Answer,
  QuestionType,
  QuizRequest,
  Submission,
  SubmissionAnswerText,
  UserCredentials,
  UserRole,
} from "Models/Arthur/QuizManager/QuizManagerModels";

describe("Quiz Submissions API Tests", () => {
  let manager: UserCredentials;
  let user: UserCredentials;
  let anotherUser: UserCredentials;
  let quiz: QuizRequest;
  let quizId: string;

  beforeEach(() => {
    return TestUserBuilder.createUser(UserRole.Manager)
      .then((admin) => {
        manager = admin;
        return TestUserBuilder.createUser(UserRole.User);
      })
      .then((u) => {
        user = u;
        return TestUserBuilder.createUser(UserRole.User);
      })
      .then((u2) => {
        anotherUser = u2;
        quiz = QuizGenerator.generateQuizWithAllTypes();
        return loginViaApi(manager);
      })
      .then(() => createAndPublishQuiz(quiz))
      .then((id) => {
        quizId = id;
      });
  });

  context("Submit", () => {
    it("Should allow User to submit a quiz", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? "Answer" : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.quizId).to.eq(quizId);
          expect(res.body.userId).to.eq(user.id);
          expect(res.body).to.have.property("id");
          expect(res.body).to.have.property("createdAt");
        });
      });
    });

    it("Should return 409 when submitting same quiz twice", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? "A" : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then(() => {
          cy.request({
            method: "POST",
            url: QuizManagerEndpoints.submitToQuiz(quizId),
            body: { answers },
            failOnStatusCode: false,
          }).then((res) => {
            expect(res.status).to.eq(409);
            expect(res.body.error).to.eq(SubmissionErrorMessages.AlreadySubmitted);
          });
        });
      });
    });

    it("Should return 404 when submitting to non-existent quiz", () => {
      const fakeId = "non-existent-id";
      const answers: Answer[] = [{ questionId: "q0", answer: "Test" }];

      loginViaApi(user).then(() => {
        cy.request({
          method: "POST",
          url: QuizManagerEndpoints.submitToQuiz(fakeId),
          body: { answers },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(404);
          expect(res.body.error).to.eq(QuizErrorMessages.QuizNotFound);
        });
      });
    });
  });

  context("Edit", () => {
    it("Should allow editing submission while quiz is active", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? SubmissionAnswerText.Initial : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then((res) => {
          const submissionId = res.body.id;

          const updatedAnswers: Answer[] = quiz.questions.map((q) => ({
            questionId: q.id,
            answer: q.type === QuestionType.Input ? SubmissionAnswerText.Updated : [q.options[1]],
          }));

          cy.request("PUT", QuizManagerEndpoints.submission(submissionId), {
            answers: updatedAnswers,
          }).then((editRes) => {
            expect(editRes.status).to.eq(200);
            expect(editRes.body.success).to.be.true;
          });
        });
      });
    });

    it("Should return 400 when editing after quiz is archived", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then((res) => {
          const submissionId = res.body.id;

          loginViaApi(manager).then(() => {
            cy.request("PATCH", QuizManagerEndpoints.quizArchive(quizId)).then(() => {
              loginViaApi(user).then(() => {
                cy.request({
                  method: "PUT",
                  url: QuizManagerEndpoints.submission(submissionId),
                  body: { answers },
                  failOnStatusCode: false,
                }).then((editRes) => {
                  expect(editRes.status).to.eq(400);
                  expect(editRes.body.error).to.eq(QuizErrorMessages.QuizNotEditable);
                });
              });
            });
          });
        });
      });
    });

    it("Should return 403 when editing another user's submission", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer2 : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then((res) => {
          const submissionId = res.body.id;

          loginViaApi(anotherUser).then(() => {
            cy.request({
              method: "PUT",
              url: QuizManagerEndpoints.submission(submissionId),
              body: { answers },
              failOnStatusCode: false,
            }).then((res) => {
              expect(res.status).to.eq(403);
              expect(res.body.error).to.eq(AuthErrorMessages.Forbidden);
            });
          });
        });
      });
    });
  });

  context("Access", () => {
    it("Should allow user to get own submissions", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then(() => {
          cy.request(QuizManagerEndpoints.mySubmissions).then((res) => {
            expect(res.status).to.eq(200);
            res.body.forEach((s: Submission) => {
              expect(s.userId).to.eq(user.id);
            });
          });
        });
      });
    });

    it("Should allow admin to get all quiz submissions", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then(() => {
          loginViaApi(manager).then(() => {
            cy.request(QuizManagerEndpoints.quizSubmissions(quizId)).then((res) => {
              expect(res.status).to.eq(200);
              res.body.forEach((s: Submission) => {
                expect(s.quizId).to.eq(quizId);
              });
            });
          });
        });
      });
    });

    it("Should allow user to get own submission by ID", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer2 : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then((res) => {
          const submissionId = res.body.id;

          cy.request(QuizManagerEndpoints.submission(submissionId)).then((getRes) => {
            expect(getRes.status).to.eq(200);
            expect(getRes.body.id).to.eq(submissionId);
            expect(getRes.body.userId).to.eq(user.id);
          });
        });
      });
    });

    it("Should allow admin to get any submission by ID", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then((res) => {
          const submissionId = res.body.id;

          loginViaApi(manager).then(() => {
            cy.request(QuizManagerEndpoints.submission(submissionId)).then((res) => {
              expect(res.status).to.eq(200);
              expect(res.body.id).to.eq(submissionId);
              expect(res.body.userId).to.eq(user.id);
            });
          });
        });
      });
    });

    it("Should return 403 when user tries to access another user's submission", () => {
      loginViaApi(user).then(() => {
        const answers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
        }));

        cy.request("POST", QuizManagerEndpoints.submitToQuiz(quizId), { answers }).then((res) => {
          const submissionId = res.body.id;

          loginViaApi(anotherUser).then(() => {
            cy.request({
              method: "GET",
              url: QuizManagerEndpoints.submission(submissionId),
              failOnStatusCode: false,
            }).then((res) => {
              expect(res.status).to.eq(403);
              expect(res.body.error).to.eq(AuthErrorMessages.Forbidden);
            });
          });
        });
      });
    });
  });
});
