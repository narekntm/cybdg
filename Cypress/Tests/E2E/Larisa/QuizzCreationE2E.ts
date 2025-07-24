import { QuizzManagementBuilders } from "Builders/Larisa/QuizzManagementBuilders";
import { addQuizz, adminLogin, baseURL, createUsers, login, manager, user } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { CommonPage } from "Pages/Larisa/CommonPage";
import { QuizzManagerPage } from "Pages/Larisa/QuizzManagerPage";
import { QuizzViewSubmissionsPage } from "Pages/Larisa/QuizzViewSubmissionsPage";

describe("Quizz Creation Suite", () => {
  let quizzDataID: string;

  const toastMessages = {
    titleError: "Quiz title cannot be empty.",
    descError: "Quiz description cannot be empty.",
    questionError: "At least one question is required.",
    quizSaved: "Quiz saved successfully!",
  };

  before(() => {
    createUsers();
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(baseURL);

    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.quizzes }).as("postQuizz");
    cy.intercept({ method: "GET", url: QuizzManagementEndPoints.quizzes }).as("getQuizz");

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
    QuizzManagerPage.quizzListCount().should("contain.text", "(0)");
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

  it("Add Quizz Test, Validate Data", () => {
    addQuizz(QuizzManagementGenerators.quizz);

    QuizzManagerPage.quizzTitleInput().should("have.value", QuizzManagementGenerators.quizz.title);
    QuizzManagerPage.quizzDescTextArea().should("have.value", QuizzManagementGenerators.quizz.description);

    QuizzManagementGenerators.quizz.questions.forEach((question, index) => {
      QuizzManagerPage.questionText(index).should("have.value", question.label);
      QuizzManagerPage.questionSelect(index).should("have.value", question.type.toLowerCase());
      if (question.options.length) {
        question.options.forEach((option, optionIndex) => {
          QuizzManagerPage.questionOptionSpan(index, optionIndex).should("have.text", option);
        });
      }
    });
  });

  it("Add Quizz Test And Save, Validate Data", () => {
    addQuizz(QuizzManagementGenerators.quizz);
    QuizzManagerPage.saveQuizzBtn().click();
    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagementBuilders.getQuizz(quizzDataID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.assignedUsers).to.deep.eq([`${user.email}`]);
        expect(response.body.createdBy).to.eq(manager.id);
        expect(response.body.title).to.eq(QuizzManagementGenerators.quizz.title);
        expect(response.body.description).to.eq(QuizzManagementGenerators.quizz.description);
        expect(response.body.questions).to.have.length(4);

        response.body.questions.forEach((question: QuizzManagementModels.ResponceQuestion, index: number) => {
          expect(question.id).to.eq(`q${index}`);
          expect(question.label).to.eq(QuizzManagementGenerators.quizz.questions[index].label);
          expect(question.type).to.eq(QuizzManagementGenerators.quizz.questions[index].type.toLowerCase());
        });
      });
      CommonPage.toast()
        .should("be.visible")
        .then(($toast) => {
          expect($toast.text().trim()).to.include(toastMessages.quizSaved);
        });
    });
  });

  it("Add several Quizzes Test, Validate Data", () => {
    for (let i = 0; i < 2; i++) {
      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        quizzDataID = xhr.response.body.id;
        QuizzManagerPage.quizzListItem(quizzDataID).should("exist");
      });
      QuizzManagerPage.toggleHeader().click();
    }
  });

  it("Add Quizz Test, Positive Case", () => {
    let quizzesCount = 0;
    cy.wait("@getQuizz").then((xhr) => {
      quizzesCount = xhr.response.body.length;
      expect(xhr.response.statusCode).to.be.oneOf([200, 304]);

      addQuizz(QuizzManagementGenerators.quizz);
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        expect(xhr.response.statusCode).to.be.oneOf([200, 304]);
      });
      QuizzManagerPage.quizzListItems().its("length").should("be.gt", quizzesCount);
    });
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

  it("Assign To User Test", () => {
    QuizzManagerPage.toggleHeader().click();
    QuizzManagerPage.assignModeSelect().select("Selected Users");
    QuizzManagerPage.userCheckBoxes().should("be.visible");
  });

  it("My Quizzes Structure Test", () => {
    addQuizz(QuizzManagementGenerators.quizz);

    QuizzManagerPage.saveQuizzBtn().click();
    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.quizzTitle(quizzDataID).should("contain.text", QuizzManagementGenerators.quizz.title);
      QuizzManagerPage.statusBadgeSpan(quizzDataID).invoke("text").should("eq", "draft");
      QuizzManagerPage.quizzDesc(quizzDataID).should("have.text", `Description: ${QuizzManagementGenerators.quizz.description}`);
      QuizzManagerPage.viewSubmission(quizzDataID).should("be.visible").and("have.text", "View Submissions");

      QuizzManagerPage.quizzPublishBtn(quizzDataID).should("be.visible");
      QuizzManagerPage.quizzArchiveBtn(quizzDataID).should("be.visible");
      QuizzManagerPage.quizzDeleteBtn(quizzDataID).should("be.visible");

      QuizzManagerPage.quizzListTitle().should("contain.text", "My Quizzes");
    });
  });

  it("No Submission Yet test", () => {
    addQuizz(QuizzManagementGenerators.quizz);

    QuizzManagerPage.saveQuizzBtn().click();
    cy.wait("@postQuizz").then((xhr) => {
      quizzDataID = xhr.response.body.id;
      QuizzManagerPage.viewSubmission(quizzDataID).click();
      QuizzViewSubmissionsPage.quizzTitle().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.title);
      QuizzViewSubmissionsPage.quizzDesc().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.description);
      QuizzViewSubmissionsPage.submissionListInfo().should("be.visible").and("have.text", "No submissions yet.");
    });
  });
});
