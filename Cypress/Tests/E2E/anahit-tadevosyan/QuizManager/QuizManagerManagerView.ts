import Chance from "chance";
import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import {
  QuizCreationData,
  QuizData,
  QuizErrorMessages,
  QuizSuccessMessages,
  Role,
  User,
  Users,
  ValidationErrorMessages,
  QuizStatus,
} from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerLoginPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";

const chance = new Chance();

describe("QuizManager Manager View", () => {
  const baseUrl = "http://127.0.0.1:5151//manager.html";
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;
  let createdQuiz: QuizData;
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

  before("create a user and login", () => {
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

  beforeEach("login by a created user", () => {
    cy.visit(baseUrl);
    cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
    login(managerUser.email, managerUser.password);
    cy.wait("@postLogin").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });

  describe("Add Questions", () => {
    it("creates a valid quiz and check if added", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.quizzes() }).as("postQuiz");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");
      createQuiz(QuizManagerGenerators.fakeQuiz);
      cy.wait("@postQuiz").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include(QuizManagerGenerators.fakeQuiz);
      });
      cy.wait("@getQuizzes").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        const quizzes = interception.response.body;
        const createdQuiz = quizzes.find(
          (quiz: QuizData) =>
            quiz.title === QuizManagerGenerators.fakeQuiz.title && quiz.description === QuizManagerGenerators.fakeQuiz.description
        );

        expect(createdQuiz).to.exist;
        expect(createdQuiz.questions).to.have.length(QuizManagerGenerators.fakeQuiz.questions.length);
      });
      QuizManagerManagerViewPage.toastContainer().should("contain", QuizSuccessMessages.QuizSaved);
    });

    it("creates an empty quiz", () => {
      const emptyQuiz = structuredClone(QuizManagerGenerators.fakeQuiz);
      emptyQuiz.title = "";
      emptyQuiz.description = "";
      emptyQuiz.questions = [];
      createQuiz(emptyQuiz);
      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.TitleRequired);
      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.DescriptionRequired);
      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.AtLeastOneQuestion);
    });
    it("creates no label questions", () => {
      const noLabelQuestionQuiz = structuredClone(QuizManagerGenerators.fakeQuiz);
      noLabelQuestionQuiz.questions[0].label = "";
      createQuiz(noLabelQuestionQuiz);
      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.MustHaveALabel);
    });
    it("creates no option quiz", () => {
      const noOptionQuiz = structuredClone(QuizManagerGenerators.fakeQuiz);
      noOptionQuiz.questions[1].options = [];
      createQuiz(noOptionQuiz);
      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.AtLeastOneOption);
    });
    it.skip("selects no user", () => {
      const noUserSelectedQuiz = structuredClone(QuizManagerGenerators.fakeQuiz);
      noUserSelectedQuiz.assignedUsers = [];
      createQuiz(noUserSelectedQuiz);
      QuizManagerManagerViewPage.toastContainer().should("contain", ValidationErrorMessages.CustomAssignmentMissingUsers);
    });
  });

  describe("My Quizzes", () => {
    it("checks if the created quiz is seen", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.quizzes() }).as("postQuiz");
      createQuiz(QuizManagerGenerators.fakeQuiz);
      cy.wait("@postQuiz").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include(QuizManagerGenerators.fakeQuiz);
        createdQuiz = interception.response.body;
        QuizManagerManagerViewPage.quizListSection().should("contain", createdQuiz.title);
        QuizManagerManagerViewPage.titleByQuizId(createdQuiz.id).should("contain", QuizManagerGenerators.fakeQuiz.title);
        QuizManagerManagerViewPage.descriptionByQuizId(createdQuiz.id).should("contain", QuizManagerGenerators.fakeQuiz.description);
        QuizManagerManagerViewPage.usersByQuizId(createdQuiz.id).should("contain", QuizManagerGenerators.fakeQuiz.assignedUsers.toString);
        QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Draft);
      });
    });
    it("checks the action buttons and statuses", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.quizzes() }).as("postQuiz");
      createQuiz(QuizManagerGenerators.fakeQuiz);
      cy.wait("@postQuiz").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.include(QuizManagerGenerators.fakeQuiz);
        createdQuiz = interception.response.body;
        QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Draft);
        QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).should("be.visible");
        QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).should("be.visible");
        QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).should("be.visible");
        cy.intercept({ method: "PATCH", url: QuizManagerEndpoints.publishQuiz(createdQuiz.id) }).as("publishQuiz");
        cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");
        QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).click();
        cy.wait("@publishQuiz").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.deep.include({ success: true });
        });
        cy.wait("@getQuizzes").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.deep.include({ ...createdQuiz, status: QuizStatus.Active });
          const quizzesCount = interception.response.body.length;
          QuizManagerManagerViewPage.quizListHeader().should("have.text", `My Quizzes (${quizzesCount})`);
        });
        QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Active);
        QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).should("not.exist");
        QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).should("be.visible");
        QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).should("be.visible");

        cy.intercept({ method: "PATCH", url: QuizManagerEndpoints.archiveQuiz(createdQuiz.id) }).as("archiveQuiz");
        cy.intercept({ method: "GET", url: QuizManagerEndpoints.quizzes() }).as("getQuizzes");
        QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).click();
        cy.wait("@archiveQuiz").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.deep.include({ success: true });
        });
        cy.wait("@getQuizzes").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.deep.include({ ...createdQuiz, status: QuizStatus.Archived });
        });

        QuizManagerManagerViewPage.statusByQuizId(createdQuiz.id).should("contain", QuizStatus.Archived);
        QuizManagerManagerViewPage.archiveByQuizId(createdQuiz.id).should("not.exist");
        QuizManagerManagerViewPage.publishByQuizId(createdQuiz.id).should("be.visible");
        QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).should("be.visible");
        cy.intercept({ method: "DELETE", url: QuizManagerEndpoints.quizzes(createdQuiz.id) }).as("deleteQuiz");

        QuizManagerManagerViewPage.deleteByQuizId(createdQuiz.id).click();
        cy.wait("@deleteQuiz").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.deep.include({ success: true });
        });
        cy.wait("@getQuizzes").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.not.deep.include(createdQuiz);
        });
        QuizManagerManagerViewPage.quizListSection().should("not.contain", createdQuiz.id);
      });
    });
  });
});
