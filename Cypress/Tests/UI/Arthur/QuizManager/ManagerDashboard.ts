import { Chance } from "chance";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import {
  createAndPublishQuizUI,
  createDraftQuizUI,
  loginViaApi,
  logoutViaApi,
} from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { frontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { QuizErrorMessages, ValidationErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import {
  AssignedUsers,
  QuestionType,
  QuizStatus,
  QuizSuccessMessages,
  UserCredentials,
  UserRole,
} from "Models/Arthur/QuizManager/QuizManagerModels";
import { ManagerPage } from "Pages/Arthur/QuizManager/ManagerPage";
import { QuizViewPage } from "Pages/Arthur/QuizManager/QuizView";

const chance = new Chance();
let manager: UserCredentials;
let user: UserCredentials;

describe("Manager Dashboard UI", () => {
  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((cred) => (manager = cred));
    TestUserBuilder.createUser(UserRole.User).then((cred) => (user = cred));
  });

  beforeEach(() => {
    loginViaApi(manager);
    cy.visit(frontendRoutes.Manager);
    ManagerPage.quizCreatorDropdown().click();
  });

  afterEach(() => {
    logoutViaApi();
  });

  context("Positive Cases", () => {
    it("Should create a new quiz with 4 question types and assign to all", () => {
      const quiz = QuizGenerator.generateQuizWithAllTypes();

      ManagerPage.quizTitleInput().type(quiz.title);
      ManagerPage.quizDescriptionInput().type(quiz.description);

      quiz.questions.forEach((q, index) => {
        ManagerPage.addQuestionButton().click();
        ManagerPage.questionTextInputs().eq(index).type(q.label);
        ManagerPage.questionTypeSelects().eq(index).select(q.type);
        q.options.forEach((opt) => {
          ManagerPage.optionInputFields().eq(index).type(opt);
          ManagerPage.addOptionButtons().eq(index).click();
        });
      });

      ManagerPage.selectAssignMode().select(AssignedUsers.All);
      ManagerPage.saveQuizButton().click();

      ManagerPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);
      ManagerPage.quizTitles().should("contain", quiz.title);
      ManagerPage.quizItemByTitle(quiz.title).within(() => {
        ManagerPage.statusBadgeWithinItem().should("contain", QuizStatus.Draft);
      });
    });

    it("Should publish a draft quiz", () => {
      createAndPublishQuizUI().then((quiz) => {
        ManagerPage.quizItemByTitle(quiz.title).within(() => {
          ManagerPage.statusBadgeWithinItem().should("contain", QuizStatus.Active);
        });
      });
    });

    it("Should archive an active quiz", () => {
      createDraftQuizUI().then((quiz) => {
        ManagerPage.quizItemByTitle(quiz.title).within(() => {
          ManagerPage.publishButtonWithin().click();
          ManagerPage.archiveButtonWithin().click();
          ManagerPage.statusBadgeWithinItem().should("contain", QuizStatus.Archived);
        });
      });
    });

    it("Should delete a quiz without submissions", () => {
      createDraftQuizUI().then((quiz) => {
        ManagerPage.quizItemByTitle(quiz.title).within(() => {
          ManagerPage.deleteButtonWithin().click();
        });
      });
    });
  });

  context("Negative Cases", () => {
    it("Should show validation toasts for missing title, description, and questions", () => {
      ManagerPage.saveQuizButton().click();
      ManagerPage.toastError().should("contain", ValidationErrorMessages.TitleRequired);
      ManagerPage.toastError().should("contain", ValidationErrorMessages.DescriptionRequired);
      ManagerPage.toastError().should("contain", ValidationErrorMessages.AtLeastOneQuestion);
    });

    it("Should show error if multiple selection-type question created without options", () => {
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Dropdown);

      ManagerPage.quizTitleInput().type(quiz.title);
      ManagerPage.quizDescriptionInput().type(quiz.description);
      ManagerPage.addQuestionButton().click();
      ManagerPage.questionTextInputs().eq(0).type(quiz.questions[0].label);
      ManagerPage.questionTypeSelects().eq(0).select(QuestionType.Dropdown);
      ManagerPage.saveQuizButton().click();
      ManagerPage.toastError().should("contain", ValidationErrorMessages.AtLeastOneOption);
    });

    it("Should show error if 'custom' assignment has no selected users", () => {
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Input);

      ManagerPage.quizTitleInput().type(quiz.title);
      ManagerPage.quizDescriptionInput().type(quiz.description);
      ManagerPage.addQuestionButton().click();
      ManagerPage.questionTextInputs().eq(0).type(quiz.questions[0].label);
      ManagerPage.questionTypeSelects().eq(0).select(QuestionType.Input);
      ManagerPage.selectAssignMode().select(AssignedUsers.Custom);
      ManagerPage.saveQuizButton().click();
      ManagerPage.toastError().should("contain", ValidationErrorMessages.CustomAssignmentMissingUsers);
    });

    it("Should show error when deleting a quiz with submissions", () => {
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Input);

      ManagerPage.quizTitleInput().type(quiz.title);
      ManagerPage.quizDescriptionInput().type(quiz.description);
      ManagerPage.addQuestionButton().click();
      ManagerPage.questionTextInputs().eq(0).type(quiz.questions[0].label);
      ManagerPage.questionTypeSelects().eq(0).select(QuestionType.Input);
      ManagerPage.selectAssignMode().select(AssignedUsers.Custom);
      ManagerPage.userCheckboxByEmail(user.email).check();
      ManagerPage.saveQuizButton().click();
      ManagerPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);

      ManagerPage.quizItemByTitle(quiz.title).within(() => {
        ManagerPage.publishButtonWithin().click();
      });

      ManagerPage.getQuizIdByTitle(quiz.title).then((quizId) => {
        logoutViaApi();
        loginViaApi(user);
        cy.visit(frontendRoutes.QuizView(quizId));

        QuizViewPage.inputByName(quiz.questions[0].id)
          .clear()
          .type(chance.word({ length: 8 }));
        QuizViewPage.submitButton().click();

        logoutViaApi();
        loginViaApi(manager);
        cy.visit(frontendRoutes.Manager);

        ManagerPage.quizItemByTitle(quiz.title).within(() => {
          ManagerPage.deleteButtonWithin().click();
        });

        ManagerPage.toastError().should("contain", QuizErrorMessages.QuizHasSubmissions);
      });
    });
  });
});
