import { QuizBuilder, UserBuilder } from "Builders/Arthur/QuizManager/QuizManagerBuilders";
import { clearAuth, loginViaApi, logoutViaApi } from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { QuestionType, QuizStatus, QuizSuccessMessages } from "Models/Arthur/QuizManager/QuizManagerModels";
import { AdminPage } from "Pages/Arthur/QuizManager/AdminPage";

const admin = UserBuilder.validAdmin();

describe("Admin Dashboard UI", () => {
  beforeEach(() => {
    clearAuth();
    loginViaApi(admin);
    AdminPage.visit();
  });

  afterEach(() => {
    logoutViaApi(false);
    clearAuth();
  });

  context("Positive Cases", () => {
    it("Should create a new quiz with 4 question types and assign to all", () => {
      const quiz = QuizBuilder.generateValidQuiz();

      AdminPage.quizTitleInput().type(quiz.title);
      AdminPage.quizDescriptionInput().type(quiz.description);

      quiz.questions.forEach((q, index) => {
        AdminPage.addQuestionButton().click();
        AdminPage.questionTextInputs().eq(index).type(q.label);
        AdminPage.questionTypeSelects().eq(index).select(q.type);
        if (q.options.length) {
          AdminPage.commaSeparatedInputs().eq(index).type(q.options.join(", "));
        }
      });
      AdminPage.selectAssignMode().select("all");
      cy.window().then((win) => {
        cy.stub(win, "alert").as("alertStub");
      });

      AdminPage.saveQuizButton().click();
      cy.get("@alertStub").should("have.been.calledWith", QuizSuccessMessages.QuizSaved);
      AdminPage.quizTitles().should("contain", quiz.title);
      AdminPage.quizItemByTitle(quiz.title).within(() => {
        AdminPage.statusBadgeWithinItem().should("contain", QuizStatus.Draft);
      });
    });

    it("Should publish a draft quiz", () => {
      AdminPage.publishButton().click();
      cy.contains("active").should("exist");
    });

    it("Should archive an active quiz", () => {
      AdminPage.archiveButton().click();
      cy.contains("archived").should("exist");
    });

    it("Should delete a quiz without submissions", () => {
      AdminPage.deleteButton().click();
      cy.on("window:confirm", () => true);
      cy.contains("Delete failed").should("not.exist");
    });

    it("Should assign quiz to specific users", () => {
      const quiz = QuizBuilder.generateQuizWithOnly(QuestionType.Input);

      AdminPage.quizTitleInput().type(quiz.title);
      AdminPage.quizDescriptionInput().type(quiz.description);

      AdminPage.addQuestionButton().click();
      AdminPage.questionTextInputs().eq(0).type(quiz.questions[0].label);
      AdminPage.questionTypeSelects().eq(0).select(quiz.questions[0].type);

      AdminPage.selectAssignMode().select("custom");
      AdminPage.userCheckboxByEmail(Cypress.env("USER_EMAIL")).check();
      AdminPage.saveQuizButton().click();
      cy.contains("Quiz saved successfully!").should("exist");
    });
  });

  context("Negative Cases", () => {
    it("Should show error if trying to create quiz without questions", () => {
      const quiz = QuizBuilder.generateValidQuiz();
      AdminPage.quizTitleInput().type(quiz.title);
      AdminPage.quizDescriptionInput().type(quiz.description);
      AdminPage.selectAssignMode().select("all");
      AdminPage.saveQuizButton().click();
      cy.on("window:alert", (text) => {
        expect(text).to.include("At least one question is required.");
      });
    });

    it("Should show error if MCQ question is created without options", () => {
      const quiz = QuizBuilder.generateQuizWithOnly(QuestionType.Dropdown);

      AdminPage.quizTitleInput().type(quiz.title);
      AdminPage.quizDescriptionInput().type(quiz.description);
      AdminPage.addQuestionButton().click();
      AdminPage.questionTextInputs().eq(0).type("Select your tech");
      AdminPage.questionTypeSelects().eq(0).select(QuestionType.Dropdown);
      AdminPage.commaSeparatedInputs().eq(0).clear();

      AdminPage.selectAssignMode().select("all");
      AdminPage.saveQuizButton().click();
      cy.on("window:alert", (text) => {
        expect(text).to.include("At least one question is required.");
      });
    });

    it("Should show error if no users selected in custom mode", () => {
      const quiz = QuizBuilder.generateQuizWithOnly(QuestionType.Input);
      AdminPage.quizTitleInput().type(quiz.title);
      AdminPage.quizDescriptionInput().type(quiz.description);
      AdminPage.addQuestionButton().click();
      AdminPage.questionTextInputs().eq(0).type(quiz.questions[0].label);
      AdminPage.questionTypeSelects().eq(0).select(QuestionType.Input);
      AdminPage.selectAssignMode().select("custom");

      AdminPage.saveQuizButton().click();
      cy.on("window:alert", (text) => {
        expect(text).to.include("Please select at least one user.");
      });
    });
  });
});
