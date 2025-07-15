export class QuizManagerUserQuizPage {
  static pageTitle = () => cy.get('header h1');

  static logoutButton = () => cy.get('header #logout-btn');

  static quizTitle = () => cy.get('#quiz-container h2');

  static quizDescription = () => cy.get('main #quiz-container #quiz-description');

  static quizForm = () => cy.get('#quiz-container #quiz-form');

  static submitButton = () => cy.get('#quiz-container #submit-btn');

  static fMQNameInput = () => cy.get('#quiz-form input[name="q1"]');

  static fMQGenderMaleRadio = () => cy.get('#quiz-form input[name="q2"][value="Male"]');

  static fMQGenderFemaleRadio = () => cy.get('#quiz-form input[name="q2"][value="Female"]');

  static fMQGenderOtherRadio = () => cy.get('#quiz-form input[name="q2"][value="Other"]');

  static fMQTechJavaScriptCheckbox = () => cy.get('#quiz-form input[name="q3"][value="JavaScript"]');

  static fMQTechPythonCheckbox = () => cy.get('#quiz-form input[name="q3"][value="Python"]');

  static fMQTechGoCheckbox = () => cy.get('#quiz-form input[name="q3"][value="Go"]');

  static fMQCountrySelect = () => cy.get('#quiz-form select[name="q4"]');

  static fMQCountryOption = (country: string) => cy.get(`#quiz-form select[name="q4"] option[value="${country}"]`);
}