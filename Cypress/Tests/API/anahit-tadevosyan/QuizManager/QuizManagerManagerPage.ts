import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { generateUser } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
import { QuizData, QuizStatus, Role, User, UserBase } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

describe("QuizManager Admin Page", () => {
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

  beforeEach(() => {
    QuizManagerBuilders.login(managerUser.email, managerUser.password).then((response) => {
      expect(response.status).to.eq(200);
    });

    QuizManagerBuilders.getCurrentUser().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.email).to.eq(managerUser.email);
    });

    QuizManagerBuilders.getQuizzes().then((response) => {
      expect(response.status).to.eq(200);
    });

    QuizManagerBuilders.getUsers().then((response) => {
      expect(response.status).to.eq(200);

      const returnedEmails = response.body.map((user: UserBase) => user.email);
      expect(returnedEmails).to.include.members([regularUser1.email, regularUser2.email]);
    });
  });

  describe("Add Quiz and delete a quiz", () => {
    it("Adds a quiz and then deletes it", () => {
      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        const currentUserId = response.body.id;

        const fakeQuiz = QuizManagerGenerators.randomQuiz;

        QuizManagerBuilders.createQuiz(fakeQuiz).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.include({
            ...fakeQuiz,
            status: QuizStatus.Draft,
            createdBy: currentUserId,
          });
          quizId = response.body.id;
        });
        QuizManagerBuilders.getQuizzes().then((response) => {
          const created = response.body.find((quiz: QuizData) => quiz.title === fakeQuiz.title);
          expect(response.status).to.eq(200);
          expect(created).to.exist;
        });
      });
      QuizManagerBuilders.deleteQuiz(quizId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({ success: true });
      });
    });
  });

  describe("Status changes check", () => {
    beforeEach("add a new quiz", () => {
      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        const currentUserId = response.body.id;

        const fakeQuiz = QuizManagerGenerators.randomQuiz;

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
    });
    afterEach("delete the created quiz", () => {
      QuizManagerBuilders.deleteQuiz(quizId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({ success: true });
      });
    });
    it("Archives the quiz", () => {
      QuizManagerBuilders.getQuizzes().then((response) => {
        const quizzes = response.body;
        const firstQuizId = quizzes[0].id;

        QuizManagerBuilders.archiveQuiz(firstQuizId).then((archiveResponse) => {
          expect(archiveResponse.status).to.eq(200);
          expect(archiveResponse.body).to.include({ success: true });

          QuizManagerBuilders.getQuizzes().then((newResponse) => {
            const updatedQuizzes = newResponse.body;
            expect(updatedQuizzes[0].status).to.eq("archived");
          });
        });
      });
    });

    it("Publishes the quiz from Archived", () => {
      QuizManagerBuilders.getQuizzes().then((response) => {
        const quizzes = response.body;
        const firstQuizId = quizzes[0].id;

        QuizManagerBuilders.publishQuiz(firstQuizId).then((publishResponse) => {
          expect(publishResponse.status).to.eq(200);
          expect(publishResponse.body).to.include({ success: true });

          QuizManagerBuilders.getQuizzes().then((newResponse) => {
            const updatedQuizzes = newResponse.body;
            expect(updatedQuizzes[0].status).to.eq("active");
          });
        });
      });
    });

    it("Publishes the quiz from Draft", () => {
      QuizManagerBuilders.getQuizzes().then((response) => {
        const quizzes = response.body;
        const firstDraftQuiz = quizzes.find((quiz: QuizData) => quiz.id === quizId);

        expect(firstDraftQuiz, "Expected at least one draft quiz").to.exist;

        const firstQuizId = firstDraftQuiz.id;
        QuizManagerBuilders.publishQuiz(firstQuizId).then((publishResponse) => {
          expect(publishResponse.status).to.eq(200);
          expect(publishResponse.body).to.include({ success: true });

          QuizManagerBuilders.getQuizzes().then((newResponse) => {
            const updatedQuizzes = newResponse.body;
            const updated = updatedQuizzes.find((q: QuizData) => q.id === firstQuizId);
            expect(updated?.status).to.eq("active");
          });
        });
      });
    });
  });
  describe("Quiz access by other user", () => {
    it("Fails to publish an archived quiz as regular user", () => {
      QuizManagerBuilders.login(regularUser1.email, regularUser1.password).then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.getQuizzes().then((response) => {
        const quizzes = response.body;
        const quizId = quizzes[0].id;

        QuizManagerBuilders.publishQuiz(quizId, false).then((response) => {
          expect(response.status).to.eq(403);
        });
      });
    });
  });
});
