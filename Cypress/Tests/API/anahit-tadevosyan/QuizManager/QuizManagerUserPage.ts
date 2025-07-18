import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { Question, QuestionType, QuizData, QuizStatus } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

describe("User View Submissions", () => {
  const user1Email = Cypress.env("USER1_EMAIL");
  const user1Password = Cypress.env("USER1_PASSWORD");
  const managerEmail = Cypress.env("MANAGER_EMAIL");
  const managerPassword = Cypress.env("MANAGER_PASSWORD");

  let quizId: string;
  let originalQuiz: QuizData;
  let submissionId: string;

  before("add a testing quiz", () => {
    QuizManagerBuilders.login(managerEmail, managerPassword).then(() => {
      const fakeQuiz = QuizManagerGenerators.fakeQuiz;

      QuizManagerBuilders.getCurrentUser().then((response) => {
        const managerId = response.body.id;

        QuizManagerBuilders.createQuiz(fakeQuiz).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.include({
            ...fakeQuiz,
            status: QuizStatus.Draft,
            createdBy: managerId,
          });

          quizId = response.body.id;

          QuizManagerBuilders.publishQuiz(quizId).then((publishRes) => {
            expect(publishRes.status).to.eq(200);
          });
        });
      });
    });
  });
  after("try to delete the quiz", () => {
    QuizManagerBuilders.login(managerEmail, managerPassword).then(() => {
      QuizManagerBuilders.deleteQuiz(quizId, false).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.include({ error: "Quiz has submissions" });
      });
    });
  });
  it("should submit and edit a quiz submission", () => {
    QuizManagerBuilders.login(user1Email, user1Password).then(() => {
      QuizManagerBuilders.getQuizById(quizId).then((quizRes) => {
        expect(quizRes.status).to.eq(200);
        originalQuiz = quizRes.body;

        const answers: Record<string, string | string[]> = {};
        originalQuiz.questions.forEach((question: Question) => {
          switch (question.type) {
            case QuestionType.Input:
              answers[question.id] = "Sample Answer";
              break;
            case QuestionType.Radio:
              answers[question.id] = question.options[0];
              break;
            case QuestionType.Checkbox:
              answers[question.id] = [question.options[0]];
              break;
            case QuestionType.Dropdown:
              answers[question.id] = question.options[0];
              break;
          }
        });

        QuizManagerBuilders.submitQuizAnswers(quizId, answers).then((submitRes) => {
          expect(submitRes.status).to.eq(200);
          submissionId = submitRes.body.id;

          const updatedAnswers: Record<string, string | string[]> = {};
          originalQuiz.questions.forEach((question) => {
            switch (question.type) {
              case QuestionType.Input:
                updatedAnswers[question.id] = "Edited input text";
                break;
              case QuestionType.Radio:
                updatedAnswers[question.id] = question.options[1];
                break;
              case QuestionType.Checkbox:
                updatedAnswers[question.id] = [question.options[1]];
                break;
              case QuestionType.Dropdown:
                updatedAnswers[question.id] = question.options[1];
                break;
            }
          });
          QuizManagerBuilders.updateSubmission(submissionId, updatedAnswers).then((editRes) => {
            expect(editRes.status).to.eq(200);
          });
        });
      });
    });
  });
});
