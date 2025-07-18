import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { Question, QuestionType, QuizData, QuizStatus } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

describe("Quiz Submission Flow", () => {
  const userEmail = Cypress.env("USER_EMAIL");
  const userPassword = Cypress.env("USER_PASSWORD");

  it("fills and submits a quiz", () => {
    QuizManagerBuilders.login(userEmail, userPassword);

    QuizManagerBuilders.getQuizzes().then((res) => {
      const quiz = res.body.find((q: QuizData) => q.status === QuizStatus.Active);

      expect(quiz).to.exist;

      QuizManagerBuilders.getQuizById(quiz.id).then(() => {
        quiz.questions.forEach((question: Question) => {
          const selectorPrefix = `[data-question-id="${question.id}"]`; // You must have data attributes for reliable selectors

          switch (question.type) {
            case QuestionType.Input:
              cy.get(`${selectorPrefix} input`).type("Sample answer");
              break;
            case QuestionType.Radio:
              cy.get(`${selectorPrefix} input[type="radio"]`).first().check({ force: true });
              break;
            case QuestionType.Checkbox:
              cy.get(`${selectorPrefix} input[type="checkbox"]`).first().check({ force: true });
              break;
            case QuestionType.Dropdown:
              cy.get(`${selectorPrefix} select`).select(question.options[0]);
              break;
          }
        });
      });

      cy.get('[data-cy="submit-quiz"]').click();

      // Verify successful submission (e.g. confirmation or API call)
      cy.contains("Quiz submitted successfully").should("exist");
    });
  });
});
