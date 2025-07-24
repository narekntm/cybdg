import Chance from "chance";
import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { createQuiz, generateUser, login } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
import { QuestionType, QuizData, Role, User } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";
import { QuizManagerSubmissionView } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerSubmissionView";
import { QuizManagerUserViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerUserViewPage";

const chance = new Chance();

describe("Manager views quiz submissions", () => {
  const baseUrl = "/manager.html";
  let managerUser: User;
  let regularUser: User;
  let createdQuiz: QuizData;
  let submittedAnswers: Record<string, string | string[]>;

  before("Authenticate and create users", () => {
    QuizManagerBuilders.Auth().then(() => {
      managerUser = generateUser(Role.Manager);
      regularUser = generateUser(Role.User);
      return Promise.all([QuizManagerBuilders.User(managerUser), QuizManagerBuilders.User(regularUser)]);
    });
  });

  it("Manager creates and publishes a quiz", () => {
    cy.visit(baseUrl);
    cy.intercept("POST", QuizManagerEndpoints.login()).as("login");
    login(managerUser.email, managerUser.password);
    cy.url().should("include", "/manager.html");
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    const fakeQuiz = QuizManagerGenerators.randomQuiz;
    cy.intercept("POST", QuizManagerEndpoints.quizzes()).as("postQuiz");
    createQuiz(fakeQuiz);

    cy.wait("@postQuiz").then((res) => {
      expect(res.response.statusCode).to.eq(200);
      createdQuiz = res.response.body;

      cy.intercept("PATCH", QuizManagerEndpoints.publishQuiz(createdQuiz.id)).as("publishQuiz");
      cy.intercept("GET", QuizManagerEndpoints.quizzes()).as("getQuizzes");
      QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).click();
      cy.wait("@publishQuiz").its("response.statusCode").should("eq", 200);
    });

    QuizManagerManagerViewPage.logoutButton().click();
    cy.url().should("include", "/login.html");
  });

  it("User submits quiz", () => {
    cy.visit(baseUrl);
    cy.intercept("POST", QuizManagerEndpoints.login()).as("login");
    login(regularUser.email, regularUser.password);
    cy.url().should("include", "/user.html");
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    QuizManagerUserViewPage.submitById(createdQuiz.id).click();
    cy.url().should("include", `/quiz-view.html?quiz=${createdQuiz.id}`);
    submittedAnswers = {};

    createdQuiz.questions.forEach((q) => {
      const selector = `[name="${q.id}"]`;
      switch (q.type) {
        case QuestionType.Input:
          const inputVal = chance.sentence({ words: 3 });
          cy.get(`input${selector}`).type(inputVal);
          submittedAnswers[q.id] = inputVal;
          break;

        case QuestionType.Radio:
          const radioVal = chance.pickone(q.options);
          cy.get(`input[type="radio"]${selector}[value="${radioVal}"]`).check();
          submittedAnswers[q.id] = radioVal;
          break;

        case QuestionType.Checkbox:
          const checkVals = chance.pickset(q.options, 2);
          Cypress._.each(checkVals, (opt) => {
            cy.get(`input[type="checkbox"]${selector}[value="${opt}"]`).check();
          });
          submittedAnswers[q.id] = checkVals;
          break;

        case QuestionType.Dropdown:
          const dropdownVal = chance.pickone(q.options);
          cy.get(`select${selector}`).select(dropdownVal);
          submittedAnswers[q.id] = dropdownVal;
          break;
      }
    });

    cy.intercept("POST", QuizManagerEndpoints.quizSubmissions(createdQuiz.id)).as("postSubmission");
    QuizManagerUserViewPage.submitBtn().click();
    cy.url().should("include", "/user.html");
    cy.wait("@postSubmission").its("response.statusCode").should("eq", 200);
    QuizManagerUserViewPage.logoutButton().click();
    cy.url().should("include", "/login.html");
  });

  it("Manager views submissions and verifies answers", () => {
    cy.visit(baseUrl);
    cy.intercept("POST", QuizManagerEndpoints.login()).as("login");
    login(managerUser.email, managerUser.password);
    cy.url().should("include", "/manager.html");
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    QuizManagerSubmissionView.viewSubmissions(createdQuiz.id).click();
    cy.url().should("include", `/view-submissions.html?quiz=${createdQuiz.id}`);

    cy.get(".submission")
      .first()
      .invoke("attr", "data-id")
      .then((submissionId) => {
        QuizManagerSubmissionView.toggleSubmission(submissionId).click();

        createdQuiz.questions.forEach((q) => {
          if (Array.isArray(submittedAnswers[q.id])) {
            (submittedAnswers[q.id] as string[]).forEach((ans) => {
              QuizManagerSubmissionView.answerByQuestionLabel(q.label).should("contain", ans);
            });
          } else {
            QuizManagerSubmissionView.answerByQuestionLabel(q.label).should("contain", submittedAnswers[q.id] as string);
          }
        });
      });
  });
});
