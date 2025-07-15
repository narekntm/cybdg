import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { QuizData, QuizStatus, Submission } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";

describe("QuizManager View Submissions", () => {
  const baseUrl = "/login.html";
  before(() => {
    cy.visit(baseUrl);
  });
  describe("Submissions view", () => {
    it("Views the submissions by quizId by admin", () => {
      QuizManagerBuilders.login(QuizManagerGenerators.adminUser.email, QuizManagerGenerators.adminUser.password).then((response) => {
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
      QuizManagerBuilders.login(QuizManagerGenerators.user1.email, QuizManagerGenerators.user1WithPassword.password).then((response) => {
        expect(response.status).to.eq(200);
      });
      QuizManagerBuilders.getQuizzes().then((response) => {
        const quizzes = response.body;
        const firstQuiz = quizzes[0];
        QuizManagerBuilders.getQuizSubmissions(firstQuiz.id).then((newResponse) => {
          expect(newResponse.status).to.eq(403);
        });
      });
    });
  });
});
