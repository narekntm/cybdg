import Chance from "chance";
import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { login } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
import { managerUser, regularUser1, setupTestUsers } from "Helpers/QuizManagerSetup";
import { QuestionType, QuizData, QuizStatus } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerCommonPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerCommonPage";
import { QuizManagerSubmissionViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerSubmissionViewPage";
import { QuizManagerUserViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerUserViewPage";

const chance = new Chance();

describe("Manager views quiz submissions", () => {
  const baseUrl = "/manager.html";

  let createdQuiz: QuizData;
  let submittedAnswers: Record<string, string | string[]>;
  let quizId: string;

  before(() => {
    setupTestUsers();
  });
  it("Manager creates and publishes a quiz", () => {
    QuizManagerBuilders.login(managerUser.email, managerUser.password);
    const randomQuiz = QuizManagerGenerators.generateQuiz();

    QuizManagerBuilders.createQuiz(randomQuiz).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.include({
        ...randomQuiz,
        status: QuizStatus.Draft,
        createdBy: managerUser.id,
      });
      quizId = response.body.id;
      createdQuiz = response.body;
      QuizManagerBuilders.publishQuiz(quizId).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
    QuizManagerBuilders.logout();
  });

  it("User submits quiz", () => {
    cy.visit(baseUrl);
    cy.intercept("POST", QuizManagerEndpoints.login()).as("login");
    login(regularUser1.email, regularUser1.password);
    cy.url().should("include", "/user.html");

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
    QuizManagerCommonPage.submitBtn().click();
    cy.url().should("include", "/user.html");
    cy.wait("@postSubmission").its("response.statusCode").should("eq", 200);
    QuizManagerCommonPage.logoutButton().click();
    cy.url().should("include", "/login.html");
  });

  it("Manager views submissions and verifies answers", () => {
    cy.visit(baseUrl);
    cy.intercept("POST", QuizManagerEndpoints.login()).as("login");
    login(managerUser.email, managerUser.password);
    cy.url().should("include", "/manager.html");
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    QuizManagerSubmissionViewPage.viewSubmissions(createdQuiz.id).click();
    cy.url().should("include", `/view-submissions.html?quiz=${createdQuiz.id}`);

    cy.get(".submission")
      .first()
      .invoke("attr", "data-id")
      .then((submissionId) => {
        QuizManagerSubmissionViewPage.toggleSubmission(submissionId).click();

        createdQuiz.questions.forEach((q) => {
          if (Array.isArray(submittedAnswers[q.id])) {
            (submittedAnswers[q.id] as string[]).forEach((ans) => {
              QuizManagerSubmissionViewPage.answerByQuestionLabel(q.label).should("contain", ans);
            });
          } else {
            QuizManagerSubmissionViewPage.answerByQuestionLabel(q.label).should("contain", submittedAnswers[q.id] as string);
          }
        });
      });
  });
});
