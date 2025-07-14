export class QuizViewPage {

    static quizTitle = () => cy.get("#quiz-title");

    static quizDescription = () => cy.get("#quiz-description");

    static nameInput = () => cy.get('input[name="q1"]');

    static genderRadio = (value: string) =>
        cy.get(`input[name="q2"][value="${value}"]`);

    static technologyCheckbox = (tech: string) =>
        cy.get(`input[name="q3"][value="${tech}"]`);

    static countrySelect = () => cy.get('select[name="q4"]');

    static selectCountry = (countryValue: string) =>
        QuizViewPage.countrySelect().select(countryValue);

    static submitButton = () => cy.get("#submit-btn");

}
