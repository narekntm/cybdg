import Chance from "chance";
import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { QuizData, QuizStatus, Role, Submission, User } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

const chance = new Chance();

describe("QuizManager View Submissions", () => {
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;
  before(() => {
    QuizManagerBuilders.Auth().then(() => {
      managerUser = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.Manager,
      };

      regularUser1 = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.User,
      };

      regularUser2 = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.User,
      };

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
      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        const currentUserId = response.body.id;

        const fakeQuiz = QuizManagerGenerators.fakeQuiz;

        QuizManagerBuilders.createQuiz(fakeQuiz).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.include({
            ...fakeQuiz,
            status: QuizStatus.Draft,
            createdBy: currentUserId,
          });
          cy.wrap(response.body.id).as("quizId");
        });
        QuizManagerBuilders.getQuizzes().then((response) => {
          const created = response.body.find((quiz: QuizData) => quiz.title === fakeQuiz.title);
          expect(response.status).to.eq(200);
          expect(created).to.exist;
        });
      });

      QuizManagerBuilders.getQuizzes().then((response) => {
        const quizzes = response.body;

        const firstQuiz = quizzes[0];
        console.log("first quiz:", firstQuiz, "quizies:", quizzes, "username:", managerUser.email, "password:", managerUser.password);
        QuizManagerBuilders.getQuizSubmissions(firstQuiz.id).then((newResponse) => {
          expect(newResponse.status).to.eq(200);

          newResponse.body.forEach((submission: Submission) => {
            expect(submission).to.include.keys("id", "quizId", "userId", "answers", "createdAt");
            expect(submission.quizId).to.eq(firstQuiz.id);
          });
        });
      });
    });

    it("Views the submissions by user", () => {
      QuizManagerBuilders.login(regularUser1.email, regularUser1.password).then((response) => {
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
