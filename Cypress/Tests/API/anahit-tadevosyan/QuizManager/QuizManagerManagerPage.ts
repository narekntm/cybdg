import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { managerUser, regularUser1, setupTestUsers } from "Helpers/QuizManagerSetup";
import { QuizData, QuizStatus } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

describe("QuizManager Admin Page", () => {
  let quizId: string;
  before(() => {
    setupTestUsers();
  });
  beforeEach(() => {
    QuizManagerBuilders.login(managerUser.email, managerUser.password);
  });

  describe("Add Quiz and delete a quiz", () => {
    it("Adds a quiz and then deletes it", () => {
      const randomQuiz = QuizManagerGenerators.generateQuiz();

      QuizManagerBuilders.createQuiz(randomQuiz).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({
          ...randomQuiz,
          status: QuizStatus.Draft,
          createdBy: managerUser.id,
        });
        quizId = response.body.id;

        QuizManagerBuilders.getQuizzes().then((response) => {
          const created = response.body.find((quiz: QuizData) => quiz.title === randomQuiz.title);
          expect(response.status).to.eq(200);
          expect(created).to.exist;
        });

        QuizManagerBuilders.deleteQuiz(quizId).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.include({ success: true });
        });

        QuizManagerBuilders.getQuizzes().then((response) => {
          const created = response.body.find((quiz: QuizData) => quiz.title === randomQuiz.title);
          expect(created).to.not.exist;
        });
      });
    });
  });

  describe("Status changes check", () => {
    beforeEach("add a new quiz", () => {
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
    });
    afterEach("delete the created quiz", () => {
      QuizManagerBuilders.deleteQuiz(quizId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({ success: true });
      });
    });
    it("Archives the quiz", () => {
      QuizManagerBuilders.archiveQuiz(quizId).then((archiveResponse) => {
          expect(archiveResponse.status).to.eq(200);
          expect(archiveResponse.body).to.include({ success: true });
      });
    });

    it("Publishes the quiz from Archived", () => {
      QuizManagerBuilders.publishQuiz(quizId).then((publishResponse) => {
          expect(publishResponse.status).to.eq(200);
          expect(publishResponse.body).to.include({ success: true });
      });
    });

    it("Publishes the quiz from Draft", () => {
      QuizManagerBuilders.publishQuiz(quizId).then((publishResponse) => {
          expect(publishResponse.status).to.eq(200);
          expect(publishResponse.body).to.include({ success: true });

          QuizManagerBuilders.getQuizzes().then((newResponse) => {
            const updatedQuizzes = newResponse.body;
            const updated = updatedQuizzes.find((q: QuizData) => q.id === quizId);
            expect(updated?.status).to.eq("active");
        });
      });
    });
  });
  describe("Quiz access by other user", () => {
    it("Fails to publish an archived quiz as regular user", () => {
      QuizManagerBuilders.login(regularUser1.email, regularUser1.password).then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.publishQuiz(quizId, false).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
  });
});
