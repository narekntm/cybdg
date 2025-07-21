export class QuizViewPage {
  static quizTitle = () => cy.get("#quiz-title");

  static quizDescription = () => cy.get("#quiz-description");

  static submitButton = () => cy.get("#submit-btn");

  static inputByLabel = (labelText: string) => cy.contains(".question", labelText).find('input[type="text"]');

  static checkboxByLabel = (questionLabel: string, value: string) =>
    cy.contains(".question", questionLabel).find(`input[type="checkbox"][value="${value}"]`);

  static radioByLabel = (questionLabel: string, value: string) =>
    cy.contains(".question", questionLabel).find(`input[type="radio"][value="${value}"]`);

  static selectByLabel = (questionLabel: string) => cy.contains(".question", questionLabel).find("select");

  static selectDropdown = (label: string, option: string) => QuizViewPage.selectByLabel(label).select(option);

  static inputByName = (name: string) => cy.get(`input[name="${name}"][type="text"]`);
}
