import { QuizManagerBuilders } from "Builders/Ani/QuizManagerBuilders";
import { AssignTo, OptionType, QuizCreation, Role, User } from "Models/Ani/QuizManagerModels";
import { QuizManagerAdminDashboardPage } from "Pages/Ani/QuizManagerAdminDashboardPage";
import { QuizManagerLoginPage } from "Pages/Ani/QuizManagerLoginPage";
import { QuizManagerUserDashboardPage } from "Pages/Ani/QuizManagerUserDashboardPage";

export function userCreate(role: Role = Role.User): Cypress.Chainable<User> {
  return QuizManagerBuilders.Auth().then((authRes) => {
    expect(authRes.status).to.eq(200);
    const token = authRes.body.token;
    expect(token).to.exist;
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: `user-${Date.now()}@example.com`,
      password: "testpass",
      role: role,
    };
    return QuizManagerBuilders.User(newUser).then((userRes) => {
      expect(userRes.status).to.eq(201);
      expect(userRes.body.message).to.eq("User created successfully");
      return cy.wrap(newUser);
    });
  });
}
export function logout() {
  QuizManagerUserDashboardPage.logoutButton().click();
}
export function login(email: string, password: string) {
  QuizManagerLoginPage.emailInput().type(email);
  QuizManagerLoginPage.passwordInput().type(password);
  QuizManagerLoginPage.loginBtn().click();
}
export function quizCreate(title: string, description: string, question: string, type: OptionType, assignTo: AssignTo): QuizCreation {
  return { title, description, question, type, assignTo };
}
export function createQuiz() {
  QuizManagerAdminDashboardPage.createNewQuizBtn().click();
  QuizManagerAdminDashboardPage.quizTitleInput().type("Quiz Creation");
  QuizManagerAdminDashboardPage.quizDescriptionInput().type("Quiz Description");
  QuizManagerAdminDashboardPage.addQuestionBtn().click();
  QuizManagerAdminDashboardPage.questionTextInput().type("What is your name?");
  QuizManagerAdminDashboardPage.questionTypeInput().type("Input");
  QuizManagerAdminDashboardPage.assignToDropdown().type("All Users");
  QuizManagerAdminDashboardPage.saveQuizBtn().click();
}
