import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuestionType, QuizCreationData, QuizData, Role, User, Users } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerLoginPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";
import { QuizManagerUserViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerUserViewPage";
import { QuizManagerSubmissionView } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerSubmissionView";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import Chance from "chance";

const chance = new Chance();

describe("Manager views quiz submissions", () => {
  const baseUrl = "http://127.0.0.1:5151/manager.html";
  let managerUser: User;
  let regularUser: User;
  let createdQuiz: QuizData;
  let submittedAnswers: Record<string, string | string[]>;

  const login = (email: string, password: string) => {
    QuizManagerLoginPage.emailInput().clear().type(email);
    QuizManagerLoginPage.passwordInput().clear().type(password);
    QuizManagerLoginPage.loginButton().click();
  };

  function createQuiz(fakeQuiz: QuizCreationData) {
    QuizManagerManagerViewPage.quizToggle().click();

    if (fakeQuiz.title) QuizManagerManagerViewPage.quizTitleInput().type(fakeQuiz.title);
    if (fakeQuiz.description) QuizManagerManagerViewPage.quizDescriptionTextarea().type(fakeQuiz.description);

    fakeQuiz.questions?.forEach((question) => {
      QuizManagerManagerViewPage.addQuestionButton().click();
      if (question.label) QuizManagerManagerViewPage.questionTitleInput(question.id).type(question.label);
      if (question.type) QuizManagerManagerViewPage.questionType(question.id).select(question.type);
      question.options?.forEach((option) => {
        if (option) QuizManagerManagerViewPage.questionOption(question.id).type(option).type("{enter}");
      });
    });

    if (fakeQuiz.assignedUsers?.length) {
      if (fakeQuiz.assignedUsers[0] === "all") {
        QuizManagerManagerViewPage.assignModeSelect().select("All Users");
      } else {
        QuizManagerManagerViewPage.assignModeSelect().select("Select Users");
        cy.intercept("GET", QuizManagerEndpoints.users).as("getUsers");
        cy.wait("@getUsers").then((interception) => {
          const allUsers = interception.response.body;
          fakeQuiz.assignedUsers.forEach((userId) => {
            const user = allUsers.find((u: Users) => u.id === userId);
            if (user) QuizManagerManagerViewPage.assignedUsersByEmail(user.email).click();
          });
        });
      }
    }

    QuizManagerManagerViewPage.saveQuizButton().click();
  }

  before("Authenticate and create users", () => {
    QuizManagerBuilders.Auth().then(() => {
      managerUser = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.Manager,
      };
      regularUser = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.User,
      };
      return Promise.all([QuizManagerBuilders.User(managerUser), QuizManagerBuilders.User(regularUser)]);
    });
  });

  it("Manager creates and publishes a quiz", () => {
    cy.visit(baseUrl);
    cy.intercept("POST", QuizManagerEndpoints.login()).as("login");
    login(managerUser.email, managerUser.password);
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    const fakeQuiz = QuizManagerGenerators.fakeQuiz;
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
  });

  it("User submits quiz", () => {
    cy.visit(baseUrl);
    cy.intercept("POST", QuizManagerEndpoints.login()).as("login");
    login(regularUser.email, regularUser.password);
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    cy.intercept("GET", QuizManagerEndpoints.quizzes()).as("getQuizzes");
    cy.wait("@getQuizzes");

    QuizManagerUserViewPage.submitById(createdQuiz.id).click();
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
          checkVals.forEach((opt) => cy.get(`input[type="checkbox"]${selector}[value="${opt}"]`).check());
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
    cy.wait("@postSubmission").its("response.statusCode").should("eq", 200);
    QuizManagerUserViewPage.logoutButton().click();
  });

  it("Manager views submissions and verifies answers", () => {
    cy.visit(baseUrl);
    cy.intercept("POST", QuizManagerEndpoints.login()).as("login");
    login(managerUser.email, managerUser.password);
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    cy.intercept("GET", QuizManagerEndpoints.quizzes()).as("getQuizzes");
    cy.wait("@getQuizzes");

    QuizManagerSubmissionView.viewSubmissions(createdQuiz.id).click();

    cy.get(".submission")
      .first()
      .invoke("attr", "data-id")
      .then((submissionId) => {
        QuizManagerSubmissionView.toggleSubmission(submissionId as string).click();

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
