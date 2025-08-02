import Chance from "chance";
import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { managerUser, regularUser1, setupTestUsers } from "Helpers/QuizManagerSetup";
import { Question, QuestionType, QuizData, Submission } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerCommonPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerCommonPage";
import { QuizManagerUserViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerUserViewPage";

const chance = new Chance();

describe("Quiz Submission Flow", () => {
  const baseUrl = "/manager.html";
  let createdQuiz: QuizData;
  let submittedQuiz: Submission;

  before(() => {
    setupTestUsers();
  });

  describe("user submits a quiz", () => {
    before("create a quiz by manager, publish it, then login by user", () => {
      QuizManagerBuilders.login(managerUser.email, managerUser.password);
      const randomQuiz = QuizManagerGenerators.generateQuiz();
      QuizManagerBuilders.createQuiz(randomQuiz).then((response) => {
        createdQuiz = response.body;
        QuizManagerBuilders.publishQuiz(createdQuiz.id);
        QuizManagerBuilders.getQuizzes().then((response) => {
          expect(response.status).to.eq(200);
          createdQuiz = response.body.find((q: QuizData) => q.id === createdQuiz.id);
        });
      });
    });

    it("fills and submits a quiz", () => {
      QuizManagerBuilders.login(regularUser1.email, regularUser1.password);
      cy.intercept("GET", QuizManagerEndpoints.quizzes()).as("getQuizzes");
      cy.visit(baseUrl);
      cy.wait("@getQuizzes").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include(createdQuiz);
      });

      QuizManagerUserViewPage.submitById(createdQuiz.id).click();
      cy.url().should("include", `/quiz-view.html?quiz=${createdQuiz.id}`);
      createdQuiz.questions.forEach((question: Question) => {
        const selector = `[name="${question.id}"]`;
        switch (question.type) {
          case QuestionType.Input:
            cy.get(`input${selector}`).type(chance.sentence({ words: 3 }));
            break;
          case QuestionType.Radio:
            if (question.options.length) {
              cy.get(`input[type="radio"]${selector}[value="${chance.pickone(question.options)}"]`).check();
            }
            break;
          case QuestionType.Checkbox:
            chance.pickset(question.options, chance.integer({ min: 1, max: question.options.length })).forEach((opt) => {
              cy.get(`input[type="checkbox"]${selector}[value="${opt}"]`).check();
            });
            break;
          case QuestionType.Dropdown:
            cy.get(`select${selector}`).select(chance.pickone(question.options));
            break;
        }
      });

      cy.intercept("POST", QuizManagerEndpoints.quizSubmissions(createdQuiz.id)).as("postSubmissions");
      cy.intercept("GET", QuizManagerEndpoints.submissionsMe()).as("getSubmissionsMe");
      QuizManagerCommonPage.submitBtn().click();
      cy.url().should("include", "user.html");
      cy.wait("@postSubmissions").its("response.statusCode").should("eq", 200);
      cy.wait("@getSubmissionsMe").then((interception) => {
        submittedQuiz = interception.response.body.find((q: Submission) => q.quizId === createdQuiz.id);
      });
    });

    it("edits the submitted quiz and saves", () => {
      QuizManagerBuilders.login(regularUser1.email, regularUser1.password);
      cy.visit(baseUrl);

      QuizManagerUserViewPage.editSubmission(submittedQuiz.id).click();
      cy.url().should("include", `quiz-view.html?quiz=${createdQuiz.id}&submission=${submittedQuiz.id}`);
      createdQuiz.questions.forEach((question: Question) => {
        const selector = `[name="${question.id}"]`;
        switch (question.type) {
          case QuestionType.Input:
            cy.get(`input${selector}`)
              .clear()
              .type(chance.sentence({ words: 4 }));
            break;
          case QuestionType.Radio:
            cy.get(`input[type="radio"]${selector}[value="${chance.pickone(question.options)}"]`).check();
            break;
          case QuestionType.Checkbox:
            chance.pickset(question.options, chance.integer({ min: 1, max: question.options.length })).forEach((opt) => {
              cy.get(`input[type="checkbox"]${selector}[value="${opt}"]`).check();
            });
            break;
          case QuestionType.Dropdown:
            cy.get(`select${selector}`).select(chance.pickone(question.options));
            break;
        }
      });

      cy.intercept("PUT", QuizManagerEndpoints.submissionById(submittedQuiz.id)).as("putSubmission");
      cy.intercept("GET", QuizManagerEndpoints.submissionsMe()).as("getSubmissionsMe");
      QuizManagerCommonPage.submitBtn().click();
      cy.url().should("include", "/user.html");
      cy.wait("@putSubmission").its("response.statusCode").should("eq", 200);
      cy.wait("@getSubmissionsMe").then((interception) => {
        submittedQuiz = interception.response.body.find((q: Submission) => q.quizId === createdQuiz.id);
      });
    });
  });
});
