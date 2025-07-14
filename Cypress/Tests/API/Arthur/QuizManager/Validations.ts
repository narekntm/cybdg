import { UserBuilder } from "Builders/Arthur/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { loginViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { QuestionType, QuizRequest } from "Models/Arthur/QuizManager/QuizManagerModels";

describe("Quiz Validation - Required rules", () => {
  const admin = UserBuilder.validAdmin();
  const user = UserBuilder.validUser();

  beforeEach(() => {
    loginViaApi(admin);
  });

  context("Quiz creation - validation", () => {
    it("Should reject quiz without questions", () => {
      const quiz: QuizRequest = {
        title: "Empty Quiz",
        description: "No questions at all",
        assignedUsers: "all",
        questions: [],
      };

      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.quizzes,
        body: quiz,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status, "BUG: server allows quiz without questions").to.eq(400);
      });
    });

    it("Should reject radio/checkbox/dropdown with empty options", () => {
      const quiz: QuizRequest = {
        title: "Bad Question Options",
        description: "Questions with empty options",
        assignedUsers: "all",
        questions: [
          { id: "q1", label: "Radio", type: QuestionType.SingleChoice, options: [] },
          { id: "q2", label: "Checkbox", type: QuestionType.MultipleChoice, options: [] },
          { id: "q3", label: "Dropdown", type: QuestionType.Dropdown, options: [] },
        ],
      };

      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.quizzes,
        body: quiz,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status, "BUG: server allows question with empty options").to.eq(400);
      });
    });

    it("Should reject invalid question structure (missing label or invalid type)", () => {
      const invalidQuiz = {
        title: "Invalid Structure",
        description: "With broken questions",
        assignedUsers: "all",
        questions: [
          { id: "q1", type: "banana", options: [] as string[] },
          { id: "q2", label: "", type: "input", options: [] as string[] },
        ],
      };

      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.quizzes,
        body: invalidQuiz as Record<string, unknown>,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status, "BUG: server allows invalid question structure").to.eq(400);
      });
    });
  });

  context("Submission - validation", () => {
    let quizId: string;

    beforeEach(() => {
      const quiz: QuizRequest = {
        title: "Submission Test Quiz",
        description: "Test submission validation",
        assignedUsers: "all",
        questions: [
          {
            id: "q1",
            label: "What's your name?",
            type: QuestionType.Input,
            options: [],
          },
        ],
      };

      cy.request("POST", QuizManagerEndpoints.quizzes, quiz).then((res) => {
        quizId = res.body.id;
        cy.request("PATCH", QuizManagerEndpoints.quizPublish(quizId));
      });

      loginViaApi(user);
    });

    it("Should reject empty answers array", () => {
      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.submitToQuiz(quizId),
        body: { answers: [] },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status, "BUG: server allows empty answers").to.eq(400);
      });
    });

    it("Should reject answer without questionId or answer", () => {
      const malformedAnswers = [{ answer: "Some answer" }];

      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.submitToQuiz(quizId),
        body: { answers: malformedAnswers as unknown },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status, "BUG: server allows missing questionId").to.eq(400);
      });
    });

    it("Should reject answer with invalid type (number instead of string/string[])", () => {
      const badAnswers = [{ questionId: "q1", answer: 123 }];

      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.submitToQuiz(quizId),
        body: { answers: badAnswers as unknown },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status, "BUG: server allows wrong answer data type").to.eq(400);
      });
    });
  });
});
