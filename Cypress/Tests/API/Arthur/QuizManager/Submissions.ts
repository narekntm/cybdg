import { SubmissionBuilder } from "Builders/Arthur/QuizManager/SubmissionBuilder";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { createAndPublishQuiz, loginViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import {
  Answer,
  QuestionType,
  QuizRequest,
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

  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((admin) => (manager = admin));
    TestUserBuilder.createUser(UserRole.User).then((u1) => (user = u1));
    TestUserBuilder.createUser(UserRole.User).then((u2) => (anotherUser = u2));
  });

  beforeEach(() => {
    quiz = QuizGenerator.generateQuizWithAllTypes();
    loginViaApi(manager);
    createAndPublishQuiz(quiz).then((id) => (quizId = id));
  });

  context("Submit", () => {
    it("Should allow User to submit a quiz", () => {
      loginViaApi(user);
      const answers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? "Answer" : [q.options[0]],
      }));

      SubmissionBuilder.submit(quizId, answers).then((submission) => {
        expect(submission.quizId).to.eq(quizId);
        expect(submission.userId).to.eq(user.id);
        expect(submission).to.have.property("id");
        expect(submission).to.have.property("createdAt");
      });
    });

    it("Should return 409 when submitting same quiz twice", () => {
      loginViaApi(user);
      const answers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? "A" : [q.options[0]],
      }));

      SubmissionBuilder.submitTwiceAndExpect409(quizId, answers, false);
    });

    it("Should return 404 when submitting to non-existent quiz", () => {
      loginViaApi(user);
      SubmissionBuilder.submitToNonExistent(false);
    });
  });

  context("Edit", () => {
    it("Should allow editing submission while quiz is active", () => {
      loginViaApi(user);
      const initialAnswers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? SubmissionAnswerText.Initial : [q.options[0]],
      }));

      SubmissionBuilder.submit(quizId, initialAnswers).then((submission) => {
        const updatedAnswers: Answer[] = quiz.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === QuestionType.Input ? SubmissionAnswerText.Updated : [q.options[1]],
        }));
        SubmissionBuilder.edit(submission.id, updatedAnswers);
      });
    });

    it("Should return 400 when editing after quiz is archived", () => {
      loginViaApi(user);
      const answers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
      }));

      SubmissionBuilder.submit(quizId, answers).then((submission) => {
        loginViaApi(manager);
        cy.request("PATCH", QuizManagerEndpoints.quizArchive(quizId));
        loginViaApi(user);
        SubmissionBuilder.editExpect400(submission.id, answers, false);
      });
    });

    it("Should return 403 when editing another user's submission", () => {
      loginViaApi(user);
      const answers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer2 : [q.options[0]],
      }));

      SubmissionBuilder.submit(quizId, answers).then((submission) => {
        loginViaApi(anotherUser);
        SubmissionBuilder.editExpect403(submission.id, answers, false);
      });
    });
  });

  context("Access", () => {
    it("Should allow user to get own submissions", () => {
      loginViaApi(user);
      const answers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
      }));

      SubmissionBuilder.submit(quizId, answers);
      SubmissionBuilder.getOwn();
    });

    it("Should allow admin to get all quiz submissions", () => {
      loginViaApi(user);
      const answers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
      }));

      SubmissionBuilder.submit(quizId, answers);
      loginViaApi(manager);
      SubmissionBuilder.getByQuizId(quizId);
    });

    it("Should allow user to get own submission by ID", () => {
      loginViaApi(user);
      const answers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer2 : [q.options[0]],
      }));

      SubmissionBuilder.submit(quizId, answers).then((submission) => {
        SubmissionBuilder.getById(submission.id, user.id);
      });
    });

    it("Should allow admin to get any submission by ID", () => {
      loginViaApi(user);
      const answers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
      }));

      SubmissionBuilder.submit(quizId, answers).then((submission) => {
        loginViaApi(manager);
        SubmissionBuilder.getById(submission.id, user.id);
      });
    });

    it("Should return 403 when user tries to access another user's submission", () => {
      loginViaApi(user);
      const answers: Answer[] = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: q.type === QuestionType.Input ? SubmissionAnswerText.Answer1 : [q.options[0]],
      }));

      SubmissionBuilder.submit(quizId, answers).then((submission) => {
        loginViaApi(anotherUser);
        SubmissionBuilder.getForbidden(submission.id, false);
      });
    });
  });
});
