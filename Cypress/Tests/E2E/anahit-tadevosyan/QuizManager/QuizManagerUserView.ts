import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import {
  Question,
  QuestionType,
  QuizCreationData,
  QuizData,
  QuizStatus,
  Role,
  Submission,
  User,
  Users,
} from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerLoginPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";
import { QuizManagerUserViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerUserViewPage";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import Chance from "chance";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
const chance = new Chance();

describe("Quiz Submission Flow", () => {
  const baseUrl = "http://127.0.0.1:5151//manager.html";
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;
  let createdQuiz: QuizData;
  let submittedQuiz: Submission;

  const login = function (email: string, password: string) {
    QuizManagerLoginPage.emailInput().clear().type(email);
    QuizManagerLoginPage.passwordInput().clear().type(password);
    QuizManagerLoginPage.loginButton().click();
  };

  function createQuiz(fakeQuiz: QuizCreationData) {
    QuizManagerManagerViewPage.quizToggle().click();

    if (fakeQuiz.title) {
      QuizManagerManagerViewPage.quizTitleInput().type(fakeQuiz.title);
    }

    if (fakeQuiz.description) {
      QuizManagerManagerViewPage.quizDescriptionTextarea().type(fakeQuiz.description);
    }

    if (fakeQuiz.questions && fakeQuiz.questions.length > 0) {
      fakeQuiz.questions.forEach((question) => {
        QuizManagerManagerViewPage.addQuestionButton().click();

        if (question.label) {
          QuizManagerManagerViewPage.questionTitleInput(question.id).type(question.label);
        }

        if (question.type) {
          QuizManagerManagerViewPage.questionType(question.id).select(question.type);
        }

        if (question.options && question.options.length > 0) {
          question.options.forEach((option) => {
            if (option) {
              QuizManagerManagerViewPage.questionOption(question.id).type(option).type("{enter}");
            }
          });
        }
      });
    }

    if (fakeQuiz.assignedUsers && fakeQuiz.assignedUsers.length > 0) {
      if (fakeQuiz.assignedUsers[0] === "all") {
        QuizManagerManagerViewPage.assignModeSelect().select("All Users");
      } else {
        QuizManagerManagerViewPage.assignModeSelect().select("Select Users");

        cy.intercept("GET", QuizManagerEndpoints.users).as("getUsers");
        cy.wait("@getUsers").then((interception) => {
          const allUsers = interception.response.body;

          fakeQuiz.assignedUsers.forEach((userId) => {
            const user = allUsers.find((u: Users) => u.id === userId);
            if (user) {
              QuizManagerManagerViewPage.assignedUsersByEmail(user.email).click();
            }
          });
        });
      }
    }

    QuizManagerManagerViewPage.saveQuizButton().click();
  }

  before("create a user", () => {
    QuizManagerBuilders.Auth().then(() => {
      managerUser = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.Manager,
      };

      regularUser1 = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.User,
      };

      regularUser2 = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.User,
      };

      return Promise.all([
        QuizManagerBuilders.User(managerUser),
        QuizManagerBuilders.User(regularUser1),
        QuizManagerBuilders.User(regularUser2),
      ]);
    });
  });

  describe("user submits a quiz", () => {
    before("create a quiz by admin,publish it then login by user", () => {
      cy.visit(baseUrl);
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(managerUser.email, managerUser.password);
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.quizzes() }).as("postQuiz");
      createQuiz(QuizManagerGenerators.fakeQuiz);
      cy.wait("@postQuiz").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        createdQuiz = interception.response.body;

        cy.intercept({ method: "PATCH", url: QuizManagerEndpoints.publishQuiz(createdQuiz.id) }).as("publishQuiz");
        cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");
        QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).click();
        cy.wait("@publishQuiz").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
        });
        cy.wait("@getQuizzes").then((interception) => {
          createdQuiz = interception.response.body.find((q: QuizData) => q.id === createdQuiz.id);
        });
      });

      QuizManagerManagerViewPage.logoutButton().click();
    });
    it("fills and submits a quiz", () => {
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(regularUser1.email, regularUser1.password);
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });

      cy.wait("@getQuizzes").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        console.log("MYYY QUIIZ:", createdQuiz);
        expect(interception.response.body).to.deep.include(createdQuiz);
      });
      QuizManagerUserViewPage.submitById(createdQuiz.id).click();
      createdQuiz.questions.forEach((question: Question) => {
        const nameSelector = `[name="${question.id}"]`;
        switch (question.type) {
          case QuestionType.Input:
            cy.get(`input${nameSelector}`).type(chance.sentence({ words: 3 }));
            break;

          case QuestionType.Radio:
            if (question.options.length > 0) {
              const randomOption = chance.pickone(question.options);
              cy.get(`input[type="radio"]${nameSelector}[value="${randomOption}"]`).check();
            }
            break;

          case QuestionType.Checkbox:
            const selectedOptions = chance.pickset(question.options, chance.integer({ min: 1, max: question.options.length }));
            selectedOptions.forEach((option) => {
              cy.get(`input[type="checkbox"]${nameSelector}[value="${option}"]`).check();
            });
            break;

          case QuestionType.Dropdown:
            if (question.options.length > 0) {
              const randomOption = chance.pickone(question.options);
              cy.get(`select${nameSelector}`).select(randomOption);
            }
            break;
        }
      });
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.quizSubmissions(createdQuiz.id) }).as("postSubmissions");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.submissionsMe() }).as("getSubmissionsMe");
      QuizManagerUserViewPage.submitBtn().click();
      cy.wait("@postSubmissions").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
      cy.wait("@getSubmissionsMe").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        submittedQuiz = interception.response.body.find((q: Submission) => q.quizId === createdQuiz.id);
      });
    });
    it("edits the submitted quiz and saves", () => {
      cy.visit(baseUrl);
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(regularUser1.email, regularUser1.password);
      cy.wait("@postLogin");

      QuizManagerUserViewPage.editSubmission(submittedQuiz.id).click();

      createdQuiz.questions.forEach((question: Question) => {
        const nameSelector = `[name="${question.id}"]`;

        switch (question.type) {
          case QuestionType.Input:
            cy.get(`input${nameSelector}`)
              .clear()
              .type(chance.sentence({ words: 4 }));
            break;

          case QuestionType.Radio:
            if (question.options.length > 0) {
              const randomOption = chance.pickone(question.options);
              cy.get(`input[type="radio"]${nameSelector}[value="${randomOption}"]`).check({ force: true });
            }
            break;

          case QuestionType.Checkbox:
            const selectedOptions = chance.pickset(question.options, chance.integer({ min: 1, max: question.options.length }));
            selectedOptions.forEach((option) => {
              cy.get(`input[type="checkbox"]${nameSelector}[value="${option}"]`).check({ force: true });
            });
            break;

          case QuestionType.Dropdown:
            if (question.options.length > 0) {
              const randomOption = chance.pickone(question.options);
              cy.get(`select${nameSelector}`).select(randomOption);
            }
            break;
        }
      });

      cy.intercept({ method: "PUT", url: QuizManagerEndpoints.submissionById(submittedQuiz.id) }).as("putSubmission");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.submissionsMe() }).as("getSubmissionsMe");
      QuizManagerUserViewPage.submitBtn().click();
      cy.wait("@putSubmission").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
      cy.wait("@getSubmissionsMe").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        submittedQuiz = interception.response.body.find((q: Submission) => q.quizId === createdQuiz.id);
      });
    });
  });
});
