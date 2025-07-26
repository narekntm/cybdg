import { Chance } from "chance";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { fillQuizFormUI, loginViaApi, logoutViaApi } from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { FrontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
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
import { CommonPage } from "Pages/Arthur/QuizManager/CommonPage";
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
    cy.visit(FrontendRoutes.Manager);
    ManagerPage.quizCreatorDropdown().click();
  });

  afterEach(() => {
    logoutViaApi();
  });

  context("Positive Cases", () => {
    it("Should create a new quiz with 4 question types and assign to all", () => {
      const quiz = QuizGenerator.generateQuizWithAllTypes();

      fillQuizFormUI(quiz);
      ManagerPage.saveQuizButton().click();

      CommonPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);
      ManagerPage.quizTitles().should("contain", quiz.title);
      ManagerPage.quizItemByTitle(quiz.title).within(() => {
        ManagerPage.statusBadgeWithinItem().should("contain", QuizStatus.Draft);
      });
    });

    it("Should publish a draft quiz", () => {
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Input);

      fillQuizFormUI(quiz);
      ManagerPage.saveQuizButton().click();
      CommonPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);

      ManagerPage.quizItemByTitle(quiz.title).within(() => {
        ManagerPage.publishButtonWithin().click();
        ManagerPage.statusBadgeWithinItem().should("contain", QuizStatus.Active);
      });
    });

    it("Should archive an active quiz", () => {
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Input);

      fillQuizFormUI(quiz);
      ManagerPage.saveQuizButton().click();
      CommonPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);

      ManagerPage.quizItemByTitle(quiz.title).within(() => {
        ManagerPage.publishButtonWithin().click();
        ManagerPage.archiveButtonWithin().click();
        ManagerPage.statusBadgeWithinItem().should("contain", QuizStatus.Archived);
      });
    });

    it("Should delete a quiz without submissions", () => {
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Input);

      fillQuizFormUI(quiz);
      ManagerPage.saveQuizButton().click();
      CommonPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);

      ManagerPage.quizItemByTitle(quiz.title).within(() => {
        ManagerPage.deleteButtonWithin().click();
      });
    });
  });

  context("Negative Cases", () => {
    it("Should show validation toasts for missing title, description, and questions", () => {
      ManagerPage.saveQuizButton().click();
      CommonPage.toastError().should("contain", ValidationErrorMessages.TitleRequired);
      CommonPage.toastError().should("contain", ValidationErrorMessages.DescriptionRequired);
      CommonPage.toastError().should("contain", ValidationErrorMessages.AtLeastOneQuestion);
    });

    it("Should show error if multiple selection-type question created without options", () => {
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Dropdown, false);

      fillQuizFormUI(quiz);
      ManagerPage.saveQuizButton().click();
      CommonPage.toastError().should("contain", ValidationErrorMessages.AtLeastOneOption);
    });

    it("Should show error if 'custom' assignment has no selected users", () => {
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Input);

      fillQuizFormUI(quiz);
      ManagerPage.selectAssignMode().select(AssignedUsers.Custom);
      ManagerPage.saveQuizButton().click();

      CommonPage.toastError().should("contain", ValidationErrorMessages.CustomAssignmentMissingUsers);
    });

    it("Should show error when deleting a quiz with submissions", () => {
      const quiz = QuizGenerator.generateQuizWithOnly(QuestionType.Input);

      fillQuizFormUI(quiz);
      ManagerPage.selectAssignMode().select(AssignedUsers.Custom);
      ManagerPage.userCheckboxByEmail(user.email).check();
      ManagerPage.saveQuizButton().click();
      CommonPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);

      ManagerPage.quizItemByTitle(quiz.title).within(() => {
        ManagerPage.publishButtonWithin().click();
      });

      ManagerPage.getQuizIdByTitle(quiz.title).then((quizId) => {
        logoutViaApi();
        loginViaApi(user);
        cy.visit(FrontendRoutes.QuizView(quizId));

        QuizViewPage.inputByName(quiz.questions[0].id)
          .clear()
          .type(chance.word({ length: 8 }));
        QuizViewPage.submitButton().click();

        logoutViaApi();
        loginViaApi(manager);
        cy.visit(FrontendRoutes.Manager);

        ManagerPage.quizItemByTitle(quiz.title).within(() => {
          ManagerPage.deleteButtonWithin().click();
        });

        CommonPage.toastError().should("contain", QuizErrorMessages.QuizHasSubmissions);
      });
    });
  });
});
