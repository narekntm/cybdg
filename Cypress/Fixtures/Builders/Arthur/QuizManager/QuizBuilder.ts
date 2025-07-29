import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import {
  AssignedUsers,
  Question,
  QuestionType,
  QuizFields,
  QuizRequest,
  QuizResponse,
  QuizStatus,
} from "Models/Arthur/QuizManager/QuizManagerModels";

export class QuizBuilder {
  static checkQuizVisible(quizId: string, failOnStatusCode = true): Cypress.Chainable {
    return cy.request<QuizResponse[]>({ url: QuizManagerEndpoints.quizzes, failOnStatusCode }).then((res) => {
      const ids = res.body.map((q) => q.id);
      expect(ids).to.include(quizId);
    });
  }

  static checkQuizHidden(quizId: string, failOnStatusCode = true): Cypress.Chainable {
    return cy.request<QuizResponse[]>({ url: QuizManagerEndpoints.quizzes, failOnStatusCode }).then((res) => {
      const ids = res.body.map((q) => q.id);
      expect(ids).not.to.include(quizId);
    });
  }

  static checkQuizDetails(quizId: string, expected: QuizRequest, createdBy: string, failOnStatusCode = true): Cypress.Chainable {
    return cy.request({ url: QuizManagerEndpoints.quiz(quizId), failOnStatusCode }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.all.keys(
        QuizFields.Id,
        QuizFields.Title,
        QuizFields.Description,
        QuizFields.AssignedUsers,
        QuizFields.Questions,
        QuizFields.Status,
        QuizFields.CreatedBy
      );
      expect(res.body.title).to.eq(expected.title);
      expect(res.body.description).to.eq(expected.description);
      expect(res.body.status).to.eq(QuizStatus.Draft);
      expect(res.body.questions).to.have.length(expected.questions.length);
      expect(res.body.assignedUsers).to.deep.eq(expected.assignedUsers || [AssignedUsers.All]);
      expect(res.body.createdBy).to.eq(createdBy);
    });
  }

  static checkQuestionTypes(quizId: string, failOnStatusCode = true): Cypress.Chainable {
    return cy.request({ url: QuizManagerEndpoints.quiz(quizId), failOnStatusCode }).then((res) => {
      const questions = res.body.questions as Question[];
      const types = questions.map((q) => q.type);
      expect(types).to.include.members([QuestionType.Input, QuestionType.SingleChoice, QuestionType.MultipleChoice, QuestionType.Dropdown]);
    });
  }

  static checkQuizExistsInList(quizId: string, failOnStatusCode = true): Cypress.Chainable {
    return cy.request({ method: "GET", url: QuizManagerEndpoints.quizzes, failOnStatusCode }).then((res) => {
      const quizzes = res.body as QuizResponse[];
      const ids = quizzes.map((q) => q.id);
      expect(ids).to.include(quizId);
    });
  }

  static checkStatus(quizId: string, status: QuizStatus, failOnStatusCode = true): Cypress.Chainable {
    return cy
      .request({ url: QuizManagerEndpoints.quiz(quizId), failOnStatusCode })
      .its("body.status")
      .should("eq", status);
  }

  static archiveQuiz(quizId: string, failOnStatusCode = true): Cypress.Chainable {
    return cy
      .request({ method: "PATCH", url: QuizManagerEndpoints.quizArchive(quizId), failOnStatusCode })
      .its("status")
      .should("eq", 200);
  }

  static checkAssignedAllByDefault(quizId: string, failOnStatusCode = true): Cypress.Chainable {
    return cy
      .request({ url: QuizManagerEndpoints.quiz(quizId), failOnStatusCode })
      .its("body.assignedUsers")
      .should("deep.eq", [AssignedUsers.All]);
  }

  static checkNotVisibleToOtherManager(quizId: string, failOnStatusCode = true): Cypress.Chainable {
    return cy.request({ url: QuizManagerEndpoints.quizzes, failOnStatusCode }).then((res) => {
      const ids = (res.body as QuizResponse[]).map((q) => q.id);
      expect(ids).not.to.include(quizId);
    });
  }

  static check403<B extends object | undefined = undefined>(
    url: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: B,
    failOnStatusCode = true
  ): Cypress.Chainable {
    return cy
      .request({
        method,
        url,
        body,
        failOnStatusCode,
      })
      .its("status")
      .should("eq", 403);
  }

  static check404(url: string, failOnStatusCode = false): Cypress.Chainable {
    return cy.request({ method: "PATCH", url, failOnStatusCode }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.include(QuizErrorMessages.QuizNotFound);
    });
  }

  static checkDeleteWithSubmissionsBlocked(quizId: string, failOnStatusCode = false): Cypress.Chainable {
    return cy
      .request({
        method: "DELETE",
        url: QuizManagerEndpoints.quiz(quizId),
        failOnStatusCode,
      })
      .then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.include(QuizErrorMessages.QuizHasSubmissions);
      });
  }
}
