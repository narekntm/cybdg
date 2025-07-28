import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { generateUser } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
import { QuizData, QuizStatus, Role, Submission, User } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

describe("QuizManager View Submissions", () => {
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;
  let quizId: string;
  before(() => {
    QuizManagerBuilders.Auth().then(() => {
      managerUser = generateUser(Role.Manager);
      regularUser1 = generateUser(Role.User);
      regularUser2 = generateUser(Role.User);

      return Promise.all([
        QuizManagerBuilders.User(managerUser),
        QuizManagerBuilders.User(regularUser1),
        QuizManagerBuilders.User(regularUser2),
      ]);
    });
  });

  describe("Submissions view", () => {
    it("Views the submissions by quizId by admin", () => {
      QuizManagerBuilders.login(managerUser.email, managerUser.password).then((response) => {
        expect(response.status).to.eq(200);
      });

      const randomQuiz = QuizManagerGenerators.generateQuiz();

      QuizManagerBuilders.createQuiz(randomQuiz).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({
          ...randomQuiz,
          status: QuizStatus.Draft,
          createdBy: managerUser.id,
        });
        quizId = response.body.id;
      });
      QuizManagerBuilders.getQuizzes().then((response) => {
        const created = response.body.find((quiz: QuizData) => quiz.title === randomQuiz.title);
        expect(response.status).to.eq(200);
        expect(created).to.exist;
      });

      QuizManagerBuilders.getQuizzes().then((response) => {
        expect(response.status).to.eq(200);
        QuizManagerBuilders.getQuizSubmissions(quizId).then((newResponse) => {
          expect(newResponse.status).to.eq(200);

          newResponse.body.forEach((submission: Submission) => {
            expect(submission).to.include.keys("id", "quizId", "userId", "answers", "createdAt");
            expect(submission.quizId).to.eq(quizId);
          });
        });
      });
    });

    it("Views the submissions by user", () => {
      QuizManagerBuilders.login(regularUser1.email, regularUser1.password).then((response) => {
        expect(response.status).to.eq(200);
      });
      QuizManagerBuilders.getQuizzes().then((response) => {
        expect(response.status).to.eq(200);
        QuizManagerBuilders.getQuizSubmissions(quizId, false).then((newResponse) => {
          expect(newResponse.status).to.eq(403);
        });
      });
    });
  });
});
