import Chance from "chance";
import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import { Question, QuestionType, QuizData, QuizStatus, Role, User } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

const chance = new Chance();

describe("User View Submissions", () => {
  let quizId: string;
  let originalQuiz: QuizData;
  let submissionId: string;
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;
  before(() => {
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
  before("add a testing quiz", () => {
    QuizManagerBuilders.login(managerUser.email, managerUser.password).then(() => {
      const fakeQuiz = QuizManagerGenerators.fakeQuiz;

      QuizManagerBuilders.getCurrentUser().then((response) => {
        const managerId = response.body.id;

        QuizManagerBuilders.createQuiz(fakeQuiz).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.include({
            ...fakeQuiz,
            status: QuizStatus.Draft,
            createdBy: managerId,
          });

          quizId = response.body.id;

          QuizManagerBuilders.publishQuiz(quizId).then((publishRes) => {
            expect(publishRes.status).to.eq(200);
          });
        });
      });
    });
  });
  after("try to delete the quiz", () => {
    QuizManagerBuilders.login(managerUser.email, managerUser.password).then(() => {
      QuizManagerBuilders.deleteQuiz(quizId, false).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.include({ error: "Quiz has submissions" });
      });
    });
  });
  it("should submit and edit a quiz submission", () => {
    QuizManagerBuilders.login(regularUser1.email, regularUser1.password).then(() => {
      QuizManagerBuilders.getSubmissionsMe(quizId).then((quizRes) => {
        expect(quizRes.status).to.eq(200);
        originalQuiz = quizRes.body;

        const answers: Record<string, string | string[]> = {};
        originalQuiz.questions.forEach((question: Question) => {
          switch (question.type) {
            case QuestionType.Input:
              answers[question.id] = "Sample Answer";
              break;
            case QuestionType.Radio:
              answers[question.id] = question.options[0];
              break;
            case QuestionType.Checkbox:
              answers[question.id] = [question.options[0]];
              break;
            case QuestionType.Dropdown:
              answers[question.id] = question.options[0];
              break;
          }
        });

        QuizManagerBuilders.submitQuizAnswers(quizId, answers).then((submitRes) => {
          expect(submitRes.status).to.eq(200);
          submissionId = submitRes.body.id;

          const updatedAnswers: Record<string, string | string[]> = {};
          originalQuiz.questions.forEach((question) => {
            switch (question.type) {
              case QuestionType.Input:
                updatedAnswers[question.id] = "Edited input text";
                break;
              case QuestionType.Radio:
                updatedAnswers[question.id] = question.options[1];
                break;
              case QuestionType.Checkbox:
                updatedAnswers[question.id] = [question.options[1]];
                break;
              case QuestionType.Dropdown:
                updatedAnswers[question.id] = question.options[1];
                break;
            }
          });
          QuizManagerBuilders.updateSubmission(submissionId, updatedAnswers).then((editRes) => {
            expect(editRes.status).to.eq(200);
          });
        });
      });
    });
  });
});
