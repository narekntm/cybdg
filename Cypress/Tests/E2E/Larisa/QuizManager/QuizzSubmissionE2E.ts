import { QuizzManagementBuilders } from "Builders/Larisa/QuizManager/QuizzManagementBuilders";
import { adminLogin, baseURL, createUsers, login, manager, userLogin } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizManager/QuizzManagementEndPoints";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizManager/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizManager/QuizzManagementModels";
import { QuizzManagerPage } from "Pages/Larisa/QuizManager/QuizzManagerPage";
import { QuizzViewPage } from "Pages/Larisa/QuizManager/QuizzViewPage";
import { QuizzViewSubmissionsPage } from "Pages/Larisa/QuizManager/QuizzViewSubmissionsPage";
import { UserPage } from "Pages/Larisa/QuizManager/UserPage";

describe("Quizz Submission Suite", () => {
  let quizzDataID: string;

  before(() => {
    QuizzManagementBuilders.auth().then(createUsers);
  });

  beforeEach(() => {
    cy.visit(baseURL);

    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.postSubmissions("*") }).as("submitQuizz");
  });

  it("User Quizz Submition Visibility", () => {
    QuizzManagementBuilders.loginUser(adminLogin).then(() => {
      QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
        quizzDataID = responce.body.id;
        QuizzManagementBuilders.publishQuizz(quizzDataID).then(() => {
          login(userLogin);
          UserPage.quizzListItem(quizzDataID).should("be.visible");
          UserPage.quizzListItemButton(quizzDataID).click();

          QuizzViewPage.quizzTitle().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.title);
          QuizzViewPage.quizzDesc().should("be.visible").and("have.text", QuizzManagementGenerators.quizz.description);
          QuizzViewPage.submitBtn().should("be.visible").and("have.text", "Submit");

          QuizzManagementGenerators.quizz.questions.forEach((item, index) => {
            QuizzViewPage.question(index).should("be.visible");
            QuizzViewPage.questionHeader(index).should("be.visible").and("have.text", item.label);

            if (item.type === QuizzManagementModels.QuestionType.Radio || item.type === QuizzManagementModels.QuestionType.Checkbox) {
              QuizzViewPage.questionOptionList(index)
                .should("be.visible")
                .and("have.length", QuizzManagementGenerators.quizz.questions[index].options.length);
            } else if (item.type === QuizzManagementModels.QuestionType.Dropdown) {
              QuizzViewPage.questionOptionSelect(index).should("be.visible");
              QuizzViewPage.questionOptionSelectOptions(index).should(
                "have.length",
                QuizzManagementGenerators.quizz.questions[index].options.length
              );
            }
          });
        });
      });
    });
  });

  it("User Quizz Submition", () => {
    QuizzManagementBuilders.loginUser(adminLogin).then(() => {
      QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
        quizzDataID = responce.body.id;
        QuizzManagementBuilders.publishQuizz(quizzDataID).then(() => {
          login(userLogin);
          UserPage.quizzListItemButton(quizzDataID).click();

          QuizzViewPage.questionInput(0).clear().type("Larisa");
          QuizzViewPage.questionOptionList(1).eq(0).check();
          QuizzViewPage.questionOptionList(2).eq(0).check();
          QuizzViewPage.questionOptionSelect(3).select(0);

          QuizzViewPage.submitBtn().click();
          cy.wait("@submitQuizz").then((xhr) => {
            expect(xhr.response.statusCode).to.eq(200);
          });
        });
      });
    });
  });

  it("Manager Quizz Submition Validation", () => {
    let submissionID: string;
    QuizzManagementBuilders.loginUser(adminLogin).then(() => {
      QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
        quizzDataID = responce.body.id;
        QuizzManagementBuilders.publishQuizz(quizzDataID).then(() => {
          const answers = QuizzManagementGenerators.generateAnswers(QuizzManagementGenerators.quizz);
          QuizzManagementBuilders.submitQuizz(quizzDataID, { answers }).then((responce) => {
            expect(responce.status).to.eq(200);
            expect(responce.statusText).to.eq("OK");
            submissionID = responce.body.id;
          });

          login(adminLogin);
          QuizzManagementBuilders.getSubmissions(quizzDataID).then((response) => {
            const submission = response.body.find((sub: QuizzManagementModels.Submission) => sub.id === submissionID);
            expect(submission).to.exist;
            QuizzManagerPage.viewSubmission(submission.quizId).click();
            QuizzViewSubmissionsPage.submissionCard(submission.id).click();

            QuizzManagerPage.quizzInfoTitle().should("contain.text", QuizzManagementGenerators.quizz.title);
            QuizzManagerPage.quizzDescription().should("contain.text", QuizzManagementGenerators.quizz.description);

            QuizzViewSubmissionsPage.submissionCardName(submission.id).should("contain.text", "Submission #");
            QuizzViewSubmissionsPage.submissionCardUser(submission.id).should("contain.text", manager.id);
            QuizzViewSubmissionsPage.submissionCardCreated(submission.id).should(
              "contain.text",
              `Created At: ${new Date(submission.createdAt).toLocaleString()}`
            );

            QuizzViewSubmissionsPage.questionTitle(submission.id, 0).should(
              "contain.text",
              QuizzManagementGenerators.quizz.questions[0].label
            );
            QuizzManagementGenerators.quizz.questions.forEach((question, index) => {
              QuizzViewSubmissionsPage.questionTitle(submission.id, index).should("contain.text", question.label);
            });

            QuizzViewSubmissionsPage.questionAnswer(submission.id, 0).should("contain.text", submission.answers.q0);
            QuizzViewSubmissionsPage.questionAnswer(submission.id, 1).should("contain.text", submission.answers.q1);
            QuizzViewSubmissionsPage.questionAnswer(submission.id, 2).should("contain.text", submission.answers.q2);
            QuizzViewSubmissionsPage.questionAnswer(submission.id, 3).should("contain.text", submission.answers.q3);
          });
        });
      });
    });
  });

  it("User Edit Submission Quizz", () => {
    QuizzManagementBuilders.loginUser(adminLogin).then(() => {
      QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
        quizzDataID = responce.body.id;
        QuizzManagementBuilders.publishQuizz(quizzDataID).then(() => {
          const answers = QuizzManagementGenerators.generateAnswers(QuizzManagementGenerators.quizz);
          QuizzManagementBuilders.submitQuizz(quizzDataID, { answers }).then((responce) => {
            expect(responce.status).to.eq(200);
            expect(responce.statusText).to.eq("OK");
          });

          login(userLogin);
          UserPage.quizzListItemButton(quizzDataID).click();

          QuizzViewPage.questionInput(0).clear().type("Larisa New");
          QuizzViewPage.questionOptionList(1).eq(1).check();
          QuizzViewPage.questionOptionList(2).eq(1).check();
          QuizzViewPage.questionOptionSelect(3).select(1);

          QuizzViewPage.submitBtn().click();
          cy.wait("@submitQuizz").then((xhr) => {
            expect(xhr.response.statusCode).to.eq(200);
            expect(xhr.response.statusMessage).to.eq("OK");
          });
        });
      });
    });
  });
});
