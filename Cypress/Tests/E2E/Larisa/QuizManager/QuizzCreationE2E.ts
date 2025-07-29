import { QuizzManagementBuilders } from "Builders/Larisa/QuizManager/QuizzManagementBuilders";
import { addQuizz, adminLogin, baseURL, createUsers, login, manager, user, userLogin } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizManager/QuizzManagementEndPoints";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizManager/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizManager/QuizzManagementModels";
import { CommonPage } from "Pages/Larisa/QuizManager/CommonPage";
import { QuizzManagerPage } from "Pages/Larisa/QuizManager/QuizzManagerPage";
import { QuizzViewSubmissionsPage } from "Pages/Larisa/QuizManager/QuizzViewSubmissionsPage";
import { UserPage } from "Pages/Larisa/QuizManager/UserPage";

describe("Quizz Creation Suite", () => {
  let quizzDataID: string;

  before(() => {
    QuizzManagementBuilders.auth().then(createUsers);
  });

  beforeEach(() => {
    cy.visit(baseURL);

    cy.intercept({ method: "GET", url: QuizzManagementEndPoints.quizzes }).as("getQuizz");
    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.quizzes }).as("postQuizz");

    login(adminLogin);
  });

  context("Quizz Creation", () => {
    it("Creation and Validation", () => {
      cy.wait("@getQuizz").then((xhr) => {
        const quizzesCount = xhr.response.body.length;

        expect(xhr.response.statusCode).to.eq(200);
        addQuizz(QuizzManagementGenerators.quizz);
        QuizzManagerPage.saveQuizzBtn().click();
        CommonPage.toast()
          .should("be.visible")
          .then(($toast) => {
            expect($toast.text().trim()).to.include("Quiz saved successfully!");
          });

        cy.wait("@postQuizz").then((xhr) => {
          quizzDataID = xhr.response.body.id;
          QuizzManagerPage.quizzListItems().its("length").should("be.gt", quizzesCount);

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
        });
      });
    });
  });

  context("Quizz Validation", () => {
    beforeEach(() => {
      addQuizz(QuizzManagementGenerators.quizz);
    });

    it("Draft Quizz Validation", () => {
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        quizzDataID = xhr.response.body.id;
        QuizzManagerPage.statusBadgeSpan(quizzDataID).invoke("text").should("eq", "draft");
        QuizzManagerPage.quizzTitle(quizzDataID).should("contain.text", QuizzManagementGenerators.quizz.title);
        QuizzManagerPage.quizzDesc(quizzDataID).should("have.text", `Description: ${QuizzManagementGenerators.quizz.description}`);

        QuizzManagerPage.viewSubmission(quizzDataID).click();
        QuizzViewSubmissionsPage.submissionListInfo().should("be.visible").and("have.text", "No submissions yet.");
      });
    });

    it("Assigned Quizzes validation", () => {
      QuizzManagerPage.userCheckBoxesItems().filter(`[value="${userLogin.email}"]`).check();
      QuizzManagerPage.saveQuizzBtn().click();
      cy.wait("@postQuizz").then((xhr) => {
        const quizId = xhr.response.body.id;
        QuizzManagerPage.quizzPublishBtn(quizId).click();
        CommonPage.logoutBtn().click();
        login(userLogin);
        cy.visit("/user.html");

        UserPage.quizzListItem(quizId).should("exist");
        UserPage.quizzListItemButton(quizId).should("have.text", "Submit");
      });
    });
  });
});
