import { QuizManagerBuilders } from "Builders/Ani/QuizManagerBuilders";
import { login, quizCreate, userCreate } from "Helper";
import { QuizCreation, Role } from "Models/Ani/QuizManagerModels";

describe("Quiz Management", () => {
  const quizForAll: QuizCreation = quizCreate("Quiz 1", "quiz description", "What is your age?", "Input", "All Users");
  let token: string;
  let quizId: string;
  beforeEach(() => {
    cy.visit("/fe/login.html");
    userCreate(Role.Manager).then((manager) => {
      login(manager.email, manager.password);
      cy.window().then((win) => {
        token = win.localStorage.getItem("token")!;
        expect(token).to.exist;
        quizCreate(quizForAll);
        cy.request({
          method: "GET",
          url: "/be/api/quizzes",
          headers: {
            Authorization: token,
          },
        }).then((res) => {
          expect(res.status).to.eq(200);
          const createdQuiz = res.body.find((quiz) => quiz.title === quizForAll.title);
          expect(createdQuiz).to.exist;
          quizId = createdQuiz.id;
          expect(quizId).to.exist;
        });
      });
    });
  });
  it("1. Quiz Publish works properly", () => {
    QuizManagerBuilders.QuizPublish(quizId, token).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("success", true);
    });
  });
  it("2. Quiz Archive works properly", () => {
    QuizManagerBuilders.QuizArchive(quizId, token).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("success", true);
    });
  });
  it("3. Quiz Delete works properly", () => {
    QuizManagerBuilders.QuizDelete(quizId, token).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("success", true);
    });
  });
});
