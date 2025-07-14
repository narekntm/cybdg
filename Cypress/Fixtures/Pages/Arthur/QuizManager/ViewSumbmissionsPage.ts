// cypress/Support/Pages/QuizSubmissionsPage.ts

export class QuizSubmissionsPage {
    static pageTitle = () => cy.get("h1").contains("Quiz Submissions");

    static logoutButton = () => cy.get("#logout-btn");

    static quizTitle = () => cy.get("#quiz-info h2");

    static quizDescription = () => cy.get("#quiz-info p");

    static totalSubmissionsText = () => cy.get("#submission-list strong").contains("Total Submissions:");

    static totalSubmissionsValue = () =>
        cy.get("#submission-list").find("p").invoke("text");

    static submissionCards = () => cy.get(".submission-card");

    static submissionCard = (index: number = 0) =>
        QuizSubmissionsPage.submissionCards().eq(index);

    static submissionUser = (index: number = 0) =>
        QuizSubmissionsPage.submissionCard(index).find("strong").contains("User:").next();

    static submissionTimestamp = (index: number = 0) =>
        QuizSubmissionsPage.submissionCard(index).find(".submission-timestamp");

    static submissionDetails = (index: number = 0) =>
        QuizSubmissionsPage.submissionCard(index).find("dl").should("be.visible");
}
