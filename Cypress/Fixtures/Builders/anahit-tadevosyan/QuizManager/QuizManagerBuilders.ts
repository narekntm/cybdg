import {QuizManagerEndpoints} from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";

export class QuizManagerBuilders{
    static login(email: string, password: string) {
        return cy.request({
            method: "POST",
            url: QuizManagerEndpoints.login(),
            body: { email, password },
        });
    }

    static logout() {
        return cy.request({
            method: "POST",
            url: QuizManagerEndpoints.logout(),
        });
    }

    static getCurrentUser() {
        return cy.request({
            method: "GET",
            url: QuizManagerEndpoints.me(),
        });
    }

    static getUsers() {
        return cy.request({
            method: "GET",
            url: QuizManagerEndpoints.users(),
        });
    }

    static createQuiz(quizData:any) {
        return cy.request({
            method: "POST",
            url: QuizManagerEndpoints.quizzes(),
            body: quizData,
        });
    }

    static publishQuiz(quizId) {
        return cy.request({
            method: "PATCH",
            url: QuizManagerEndpoints.publishQuiz(quizId),
        });
    }

    static archiveQuiz(quizId) {
        return cy.request({
            method: "PATCH",
            url: QuizManagerEndpoints.archiveQuiz(quizId),
        });
    }

    static deleteQuiz(quizId) {
        return cy.request({
            method: "DELETE",
            url: QuizManagerEndpoints.quizzes(quizId),
        });
    }


    static getQuizzes() {
        return cy.request({
            method: "GET",
            url: QuizManagerEndpoints.quizzes(),
        });
    }

    static getQuizById(quizId) {
        return cy.request({
            method: "GET",
            url: QuizManagerEndpoints.quizzes(quizId),
        });
    }


    static submitQuizAnswers(quizId, answers) {
        return cy.request({
            method: "POST",
            url: QuizManagerEndpoints.quizSubmissions(quizId),
            body: { answers },
        });
    }

    static updateSubmission(submissionId, answers) {
        return cy.request({
            method: "PUT",
            url: QuizManagerEndpoints.submissionById(submissionId),
            body: { answers },
        });
    }


    static getMySubmissions() {
        return cy.request({
            method: "GET",
            url: QuizManagerEndpoints.submissionsMe(),
        });
    }


    static getQuizSubmissions(quizId) {
        return cy.request({
            method: "GET",
            url: QuizManagerEndpoints.quizSubmissions(quizId),
        });
    }

    static getSubmission(submissionId) {
        return cy.request({
            method: "GET",
            url: QuizManagerEndpoints.submissionById(submissionId),
        });
    }
}
