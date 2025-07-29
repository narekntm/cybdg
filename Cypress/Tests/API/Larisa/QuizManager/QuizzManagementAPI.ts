import { QuizzManagementBuilders } from "Builders/Larisa/QuizManager/QuizzManagementBuilders";
import { adminLogin, createUsers } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizManager/QuizzManagementGenerators";

describe("QuizzManagement Suite", () => {
  before(() => {
    QuizzManagementBuilders.auth().then(createUsers);
  });

  beforeEach(() => {
    QuizzManagementBuilders.loginUser(adminLogin);
  });

  it("Add a quizz", () => {
    QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
      expect(responce.status).to.eq(200);
      expect(responce.statusText).to.eq("OK");
    });
  });

  it("Publish a Quizz", () => {
    QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz)
      .then((res) => QuizzManagementBuilders.publishQuizz(res.body.id))
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.statusText).to.eq("OK");
      });
  });

  it("Get and validate Quizz", () => {
    QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
      const quizId = responce.body.id;

      return QuizzManagementBuilders.getQuizz(quizId).then((response) => {
        const returnedQuiz = response.body;

        expect(returnedQuiz).to.include({
          id: quizId,
          title: QuizzManagementGenerators.quizz.title,
          description: QuizzManagementGenerators.quizz.description,
        });

        expect(returnedQuiz.questions).to.have.length(QuizzManagementGenerators.quizz.questions.length);
      });
    });
  });

  it("Archive a Quizz", () => {
    QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz)
      .then((response) => QuizzManagementBuilders.archiveQuizz(response.body.id))
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.statusText).to.eq("OK");
      });
  });

  it("Delete a Quiz", () => {
    QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz)
      .then((response) => QuizzManagementBuilders.deleteQuizz(response.body.id))
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.statusText).to.eq("OK");
      });
  });

  it("Submit Quizz", () => {
    const answers = QuizzManagementGenerators.generateAnswers(QuizzManagementGenerators.quizz);

    QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz)
      .then((response) => QuizzManagementBuilders.submitQuizz(response.body.id, { answers }))
      .then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
  });
});
