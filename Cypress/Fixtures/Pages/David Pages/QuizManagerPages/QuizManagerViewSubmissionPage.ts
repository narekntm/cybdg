export class ViewSubmissionPage {

  static quizHeader = () => cy.get('.quiz-header')

  static quizHeaderTitle =  () => cy.get('.quiz-header h2')

  static quizHeaderDescription =  () => cy.get('.quiz-header p')

  static submissionList = () => cy.get('#submission-list')

  static submissionListMessage = ()  => cy.get('#submission-list p')

}