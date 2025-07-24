import Chance from "chance";
import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { createQuiz, generateUser, login } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
import { Question, QuestionType, QuizData, Role, Submission, User } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";
import { QuizManagerUserViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerUserViewPage";

const chance = new Chance();

describe("Quiz Submission Flow", () => {
  const baseUrl = "/manager.html";
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;
  let createdQuiz: QuizData;
  let submittedQuiz: Submission;

  before("create a user and login", () => {
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
  describe("user submits a quiz", () => {
    before("create a quiz by manager, publish it, then login by user", () => {
      cy.visit(baseUrl);
      cy.intercept("POST", QuizManagerEndpoints.login()).as("postLogin");
      login(managerUser.email, managerUser.password);
      cy.url().should("include", "/manager.html");
      cy.wait("@postLogin").its("response.statusCode").should("eq", 200);

      cy.intercept("POST", QuizManagerEndpoints.quizzes()).as("postQuiz");
      createQuiz(QuizManagerGenerators.randomQuiz);
      cy.wait("@postQuiz").then((interception) => {
        createdQuiz = interception.response.body;
        cy.intercept("GET", QuizManagerEndpoints.quizzes()).as("getQuizzes");
        QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).click();
        cy.wait("@getQuizzes").then((interception) => {
          createdQuiz = interception.response.body.find((q: QuizData) => q.id === createdQuiz.id);
        });
      });

      QuizManagerManagerViewPage.logoutButton().click();
      cy.url().should("include", "/login.html");
    });

    it("fills and submits a quiz", () => {
      cy.intercept("POST", QuizManagerEndpoints.login()).as("postLogin");
      cy.intercept("GET", QuizManagerEndpoints.quizzes()).as("getQuizzes");
      login(regularUser1.email, regularUser1.password);
      cy.url().should("include", "/user.html");
      cy.wait("@postLogin").its("response.statusCode").should("eq", 200);

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
      QuizManagerUserViewPage.submitBtn().click();
      cy.url().should("include", "user.html");
      cy.wait("@postSubmissions").its("response.statusCode").should("eq", 200);
      cy.wait("@getSubmissionsMe").then((interception) => {
        submittedQuiz = interception.response.body.find((q: Submission) => q.quizId === createdQuiz.id);
      });
    });

    it("edits the submitted quiz and saves", () => {
      cy.visit(baseUrl);
      cy.intercept("POST", QuizManagerEndpoints.login()).as("postLogin");
      login(regularUser1.email, regularUser1.password);
      cy.url().should("include", "/user.html");
      cy.wait("@postLogin");

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
      QuizManagerUserViewPage.submitBtn().click();
      cy.url().should("include", "/user.html");
      cy.wait("@putSubmission").its("response.statusCode").should("eq", 200);
      cy.wait("@getSubmissionsMe").then((interception) => {
        submittedQuiz = interception.response.body.find((q: Submission) => q.quizId === createdQuiz.id);
      });
    });
  });
});
