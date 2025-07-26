import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { AuthErrorMessages, QuizErrorMessages, SubmissionErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import { Answer, Submission } from "Models/Arthur/QuizManager/QuizManagerModels";

export class SubmissionBuilder {
  static submit(quizId: string, answers: Answer[], failOnStatusCode = true): Cypress.Chainable<Submission> {
    return cy
      .request({
        method: "POST",
        url: QuizManagerEndpoints.submitToQuiz(quizId),
        body: { answers },
        failOnStatusCode,
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        return res.body as Submission;
      });
  }

  static submitTwiceAndExpect409(quizId: string, answers: Answer[], failOnStatusCode = true): void {
    cy.request({ method: "POST", url: QuizManagerEndpoints.submitToQuiz(quizId), body: { answers }, failOnStatusCode }).then(() => {
      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.submitToQuiz(quizId),
        body: { answers },
        failOnStatusCode,
      }).then((res) => {
        expect(res.status).to.eq(409);
        expect(res.body.error).to.eq(SubmissionErrorMessages.AlreadySubmitted);
      });
    });
  }

  static submitToNonExistent(failOnStatusCode = true): void {
    const answers: Answer[] = [{ questionId: "q0", answer: "Test" }];
    cy.request({
      method: "POST",
      url: QuizManagerEndpoints.submitToQuiz("non-existent-id"),
      body: { answers },
      failOnStatusCode,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.eq(QuizErrorMessages.QuizNotFound);
    });
  }

  static edit(submissionId: string, answers: Answer[], failOnStatusCode = true): void {
    cy.request({
      method: "PUT",
      url: QuizManagerEndpoints.submission(submissionId),
      body: { answers },
      failOnStatusCode,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
    });
  }

  static editExpect400(submissionId: string, answers: Answer[], failOnStatusCode = true): void {
    cy.request({
      method: "PUT",
      url: QuizManagerEndpoints.submission(submissionId),
      body: { answers },
      failOnStatusCode,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq(QuizErrorMessages.QuizNotEditable);
    });
  }

  static editExpect403(submissionId: string, answers: Answer[], failOnStatusCode = true): void {
    cy.request({
      method: "PUT",
      url: QuizManagerEndpoints.submission(submissionId),
      body: { answers },
      failOnStatusCode,
    }).then((res) => {
      expect(res.status).to.eq(403);
      expect(res.body.error).to.eq(AuthErrorMessages.Forbidden);
    });
  }

  static getOwn(failOnStatusCode = true): void {
    cy.request({
      method: "GET",
      url: QuizManagerEndpoints.mySubmissions,
      failOnStatusCode,
    }).then((res) => {
      expect(res.status).to.eq(200);
      res.body.forEach((s: Submission) => {
        expect(s.userId).to.exist;
      });
    });
  }

  static getByQuizId(quizId: string, failOnStatusCode = true): void {
    cy.request({
      method: "GET",
      url: QuizManagerEndpoints.quizSubmissions(quizId),
      failOnStatusCode,
    }).then((res) => {
      expect(res.status).to.eq(200);
      res.body.forEach((s: Submission) => {
        expect(s.quizId).to.eq(quizId);
      });
    });
  }

  static getById(submissionId: string, expectedUserId: string, failOnStatusCode = true): void {
    cy.request({
      method: "GET",
      url: QuizManagerEndpoints.submission(submissionId),
      failOnStatusCode,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.eq(submissionId);
      expect(res.body.userId).to.eq(expectedUserId);
    });
  }

  static getForbidden(submissionId: string, failOnStatusCode = true): void {
    cy.request({
      method: "GET",
      url: QuizManagerEndpoints.submission(submissionId),
      failOnStatusCode,
    }).then((res) => {
      expect(res.status).to.eq(403);
      expect(res.body.error).to.eq(AuthErrorMessages.Forbidden);
    });
  }
}
