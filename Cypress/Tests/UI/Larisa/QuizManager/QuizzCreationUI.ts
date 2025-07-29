import { QuizzManagementBuilders } from "Builders/Larisa/QuizManager/QuizzManagementBuilders";
import { addQuizz, adminLogin, baseURL, createUsers, login } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizManager/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizManager/QuizzManagementModels";
import { CommonPage } from "Pages/Larisa/QuizManager/CommonPage";
import { QuizzManagerPage } from "Pages/Larisa/QuizManager/QuizzManagerPage";

describe("Quizz Management UI Suite", () => {
  const toastMessages = {
    titleError: "Quiz title cannot be empty.",
    descError: "Quiz description cannot be empty.",
    questionError: "At least one question is required.",
  };

  before(() => {
    QuizzManagementBuilders.auth().then(createUsers);
  });

  beforeEach(() => {
    cy.visit(baseURL);

    login(adminLogin);
  });

  it("Admin Dashboard Modal Content Test", () => {
    QuizzManagerPage.toggleHeader().should("be.visible").and("have.text", "Create New Quizz");
    QuizzManagerPage.toggleHeader().click();

    QuizzManagerPage.quizzTitleLbl().should("be.visible").and("contain.text", "Quizz Title");
    QuizzManagerPage.quizzTitleInput().should("be.visible").and("be.enabled").and("have.attr", "required");
    QuizzManagerPage.quizzDescLbl().should("be.visible").and("contain.text", "Quizz Description");
    QuizzManagerPage.quizzDescTextArea().should("be.visible").and("be.enabled").and("have.attr", "required");
    QuizzManagerPage.addQuestionBtn().should("be.visible").and("have.text", "+ Add Question");
    QuizzManagerPage.assignToLbl().should("have.text", "Assign To:");
    QuizzManagerPage.assignModeOptions().then((options) => {
      expect(options).to.have.length(2);
      expect(options[0]).to.have.text("All Users");
      expect(options[1]).to.have.text("Selected Users");
    });
    QuizzManagerPage.saveQuizzBtn().should("be.visible").and("have.text", "Save Quizz");
    QuizzManagerPage.quizzListTitle().should("contain.text", "My Quizzes");
  });

  it("Add Quizz Question Section Test", () => {
    QuizzManagerPage.toggleHeader().click();
    QuizzManagerPage.addQuestionBtn().should("be.visible");
    QuizzManagerPage.addQuestionBtn().click();

    QuizzManagerPage.questionText(0).should("be.visible").and("be.enabled").and("have.attr", "required");
    QuizzManagerPage.questionSelectOptions(0).should("have.length", 4);
    QuizzManagerPage.questionRemoveBtn(0).should("be.visible").and("have.text", "Remove");

    QuizzManagerPage.questionSelect(0).select(QuizzManagementModels.QuestionType.Input);
    QuizzManagerPage.questionOptions(0).should("not.be.visible");
    QuizzManagerPage.addOptionInputBtn(0).should("not.be.visible");

    QuizzManagerPage.questionSelect(0).select(QuizzManagementModels.QuestionType.Radio);
    QuizzManagerPage.questionOptions(0).should("be.visible");
    QuizzManagerPage.addOptionInputBtn(0).should("be.visible");
  });

  it("Add Option Text to question Section Test", () => {
    QuizzManagerPage.toggleHeader().click();
    QuizzManagerPage.addQuestionBtn().click();

    QuizzManagerPage.questionSelect(0).select(QuizzManagementModels.QuestionType.Radio);
    QuizzManagerPage.questionOptions(0).clear().type("Option 1");
    QuizzManagerPage.addOptionInputBtn(0).click();
    QuizzManagerPage.questionOptions(0).clear().type("Option 2{enter}");
    QuizzManagerPage.questionOptionListItems(0).its("length").should("be.eq", 2);
  });

  it("Assign To User Test", () => {
    QuizzManagerPage.toggleHeader().click();
    QuizzManagerPage.assignModeSelect().select("Selected Users");
    QuizzManagerPage.userCheckBoxes().should("be.visible");
  });

  it("Add Quizz Test, Negative Case", () => {
    QuizzManagerPage.toggleHeader().click();
    QuizzManagerPage.saveQuizzBtn().click();

    CommonPage.toast()
      .should("be.visible")
      .then(($toast) => {
        const text = $toast.text().trim();
        expect(text).to.include(toastMessages.titleError);
        expect(text).to.include(toastMessages.descError);
        expect(text).to.include(toastMessages.questionError);
      });
  });

  it("Save quizz without questions", () => {
    QuizzManagerPage.toggleHeader().click();
    QuizzManagerPage.quizzTitleInput().type("Quiz Title");
    QuizzManagerPage.quizzDescTextArea().type("Quizz desc");
    QuizzManagerPage.saveQuizzBtn().click();

    CommonPage.toast()
      .should("be.visible")
      .then(($toast) => {
        const text = $toast.text().trim();
        expect(text).to.include(toastMessages.questionError);
      });
  });

  it("Remove question Test", () => {
    addQuizz(QuizzManagementGenerators.quizz);
    QuizzManagerPage.questionListItems()
      .its("length")
      .then((count: number) => {
        QuizzManagerPage.questionRemoveBtn(0).click();
        QuizzManagerPage.questionListItems().its("length").should("be.lt", count);
      });
  });

  it("Remove question option Test", () => {
    addQuizz(QuizzManagementGenerators.quizz);
    QuizzManagerPage.questionOptionListItems(1).then((items) => {
      const initialCount = items.length;
      QuizzManagerPage.questionOptionRemove(1, 1).click();
      QuizzManagerPage.questionOptionListItems(1).should("have.length", initialCount - 1);
    });
  });

  it("Selecting users via checkboxes", () => {
    QuizzManagerPage.toggleHeader().click();
    QuizzManagerPage.assignModeSelect().select("Selected Users");
    QuizzManagerPage.userCheckBoxesItems().should("exist").and("have.length.greaterThan", 0);
    QuizzManagerPage.userCheckBoxesItems().eq(0).check().should("be.checked");
    QuizzManagerPage.userCheckBoxesItems().eq(0).uncheck().should("not.be.checked");
  });
});
