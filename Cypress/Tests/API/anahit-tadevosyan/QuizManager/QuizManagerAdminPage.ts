import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { QuizStatus } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizData } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

describe("QuizManager Admin Page", () => {
  const baseUrl = "/login.html";
  beforeEach(() => {
    cy.visit(baseUrl);
    QuizManagerBuilders.login(QuizManagerGenerators.adminUser.email, QuizManagerGenerators.adminUser.password).then((response) => {
      expect(response.status).to.eq(200);
    });
    QuizManagerBuilders.getCurrentUser().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.eq(QuizManagerGenerators.adminUser);
    });
    QuizManagerBuilders.getQuizzes().then((response) => {
        expect(response.status).to.eq(200);
    })
    QuizManagerBuilders.getUsers().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.eq([QuizManagerGenerators.user1, QuizManagerGenerators.user2]);
    });
  });
  describe("Add Quiz", () => {
    it("Adds a quiz", () => {
      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        const currentUserId = response.body.id;
        const fakeQuiz = QuizManagerGenerators.fakeQuiz;
        QuizManagerBuilders.createQuiz(fakeQuiz).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.include({ ...fakeQuiz, status: QuizStatus.Draft, createdBy: currentUserId });
        });
      });
    });
  });
  describe("Status changes check", () => {
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
    it('Publishes the quiz from Archived', () => {
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
    })
      it('Publishes the quiz from Draft', () => {
          QuizManagerBuilders.getQuizzes().then((response) => {
              const quizzes = response.body;
              const firstDraftQuiz = quizzes.find((quiz: QuizData) => quiz.status === 'draft');

              expect(firstDraftQuiz, 'Expected at least one draft quiz').to.exist;

              const firstQuizId = firstDraftQuiz.id;
              QuizManagerBuilders.publishQuiz(firstQuizId).then((publishResponse) => {
                  expect(publishResponse.status).to.eq(200);
                  expect(publishResponse.body).to.include({ success: true });
                  QuizManagerBuilders.getQuizzes().then((newResponse) => {
                      const updatedQuizzes = newResponse.body;
                      expect(updatedQuizzes[0].status).to.eq("active");
                  });
              });
      })
  });
});
