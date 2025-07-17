import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { Submission } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

describe("QuizManager View Submissions", () => {
  const managerEmail = Cypress.env("MANAGER_EMAIL");
  const managerPassword = Cypress.env("MANAGER_PASSWORD");
  const user1Email = Cypress.env("USER1_EMAIL");
  const user1Password = Cypress.env("USER1_PASSWORD");

  describe("Submissions view", () => {
    it("Views the submissions by quizId by admin", () => {
      QuizManagerBuilders.login(managerEmail, managerPassword).then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.getQuizzes().then((response) => {
        const quizzes = response.body;
        const firstQuiz = quizzes[0];

        QuizManagerBuilders.getQuizSubmissions(firstQuiz.id).then((newResponse) => {
          expect(newResponse.status).to.eq(200);

          newResponse.body.forEach((submission: Submission) => {
            expect(submission).to.include.keys("id", "quizId", "userId", "answers", "createdAt");
            expect(submission.quizId).to.eq(firstQuiz.id);
            expect(submission.answers).to.be.an("object");
          });
        });
      });
    });

    it("Views the submissions by user", () => {
      QuizManagerBuilders.login(user1Email, user1Password).then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.getQuizzes().then((response) => {
        const quizzes = response.body;
        const firstQuiz = quizzes[0];

        QuizManagerBuilders.getQuizSubmissions(firstQuiz.id, false).then((newResponse) => {
          expect(newResponse.status).to.eq(403);
        });
      });
    });
  });
});
