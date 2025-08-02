import { QuizzManagerEndpoints } from "EndPoints/Anna/QuizzManagerEndpoints/QuizzManagerEndpoints"
import { QuizzManagerAdminViewPage } from "Pages/Anna/QuizzManager/QuizzManagerAdminViewPage";
import { QuizzManagerLoginPage } from "Pages/Anna/QuizzManager/QuizzManagerLoginPage";



describe("Quizz Manager page", () => {
  const baseUrl = "/login";


  beforeEach(() => {
    // Intercept all relevant API calls
    cy.intercept("GET", QuizzManagerEndpoints.users()).as("getUsers");
    cy.intercept("POST", QuizzManagerEndpoints.quizzes()).as("PostCreateQuiz");
    //cy.intercept("PUT", UserManagerEndpoints.users("*")).as("updateUser");
    cy.intercept("DELETE", QuizzManagerEndpoints.deleteQuiz("*")).as("deleteQuiz");
    cy.intercept("PATCH", QuizzManagerEndpoints.publishQuiz("*")).as("PatchPublish");
    cy.intercept("PATCH", QuizzManagerEndpoints.archiveQuiz("*")).as("PatchArchive");
    cy.intercept("POST", QuizzManagerEndpoints.adminLogin).as("PostAdminLogin");
    cy.intercept("POST", QuizzManagerEndpoints.adminLogout).as("PostAdminLogout");


    // Visit app and wait for initial load
    cy.visit(baseUrl);
    cy.wait("@getquizzes");
  });

  const managerEmail:string = Cypress.env("MANAGER_EMAIL");
  const managerPassword:string = Cypress.env("MANAGER_PASSWORD");

  const invalidEmail = "managerxxxxxx@example.com";
  const invalidPassword = "manager####";

  const quizzErrors = {
    titleError: "Quiz title cannot be empty.",
    descError: "Quiz description cannot be empty.",
    questionError: "At least one question is required.",
  };

  function loginAsManager(email:string = managerEmail, password:string = managerPassword) {
    QuizzManagerLoginPage.emailInput().type(email);
    QuizzManagerLoginPage.passwordInput().type(password);
    QuizzManagerLoginPage.submitButton().click();
    cy.wait("@PostAdminLogin").its("resp.statusCode").should("eq", 200);
  }

  function addNewquizz (quizz: {
    title: string;
    description: string;
    question: string;
    type: OptionType;
    option:string;
    assignTo: AssignTo }) {
    if (quizz.title)QuizzManagerAdminViewPage.quizTitleInput().clear().type(quizz.title);
    if (quizz.description)QuizzManagerAdminViewPage.quizDescriptionTextarea().clear().type(quizz.description);
     QuizzManagerAdminViewPage.addQuestionButton().click();
    if (question.questionText)QuizzManagerAdminViewPage.questionText(index).clear().type(question.questionText);
    if (question.type)QuizzManagerAdminViewPage.questionSelect(index).select(question.type);
    if (question.options)QuizzManagerAdminViewPage.questionOptions(index).type(question.options);
  }




  describe("🔐 Manager Login", () => {
    it("Logs in with valid credentials", () => {
      loginAsManager(managerEmail, managerPassword);
    });


    it("Fails with invalid credentials", () => {
      loginAsManager(invalidEmail, invalidPassword)
      cy.wait("@PostAdminLogin").its("resp.statusCode").should("eq", 401);
    });

    it("Shows validation errors on empty quiz form", () => {
      loginAsManager(managerEmail, managerPassword);
      QuizzManagerAdminViewPage.saveQuizButton().click();


    });


    it("Logout in manager page, test", () => {
      loginAsManager(managerEmail, managerPassword);
      QuizzManagerAdminViewPage.logoutButton().click();
      cy.wait("@PostAdminLogout").its("resp.statusCode").should("eq", 200);
    });


    it("Adds a valid quizz", () => {
      addNewquizz({
        title: "Quizz Title",
        description: "Quizz description",
        question: "Question text",
        type: "Checkbox",
        option: ["Text1", "Text2", "Text3"],
        assignTo: AssignedUsers
      })
    QuizzManagerAdminViewPage.saveQuizButton().click();
      cy.wait("@PostCreateQuiz");

    });


    it("Adds a invalid quizz", () => {
      addNewquizz({
        title: "",
        description: "Quizz description",
        question: "Question text",
        type: "Checkbox",
        option: ["Text1", "Text2", "Text3"],
        assignTo: AssignedUsers
      })
      QuizzManagerAdminViewPage.saveQuizButton().click();
      cy.wait("@PostCreateQuiz");

    });
  })
 })

