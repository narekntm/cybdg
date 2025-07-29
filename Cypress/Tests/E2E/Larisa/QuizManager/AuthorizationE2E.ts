import { QuizzManagementBuilders } from "Builders/Larisa/QuizManager/QuizzManagementBuilders";
import { adminLogin, baseURL, createUsers, login, userLogin } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizManager/QuizzManagementEndPoints";
import { UserManagementModels } from "Models/Larisa/QuizManager/UserManagementModels";
import { CommonPage } from "Pages/Larisa/QuizManager/CommonPage";
import { UserPage } from "Pages/Larisa/QuizManager/UserPage";

describe("Quizz Authorization Suite", () => {
  context("Authorization Suite", () => {
    before(() => {
      QuizzManagementBuilders.auth().then(createUsers);
    });

    beforeEach(() => {
      cy.visit(baseURL);

      cy.intercept({ method: "POST", url: QuizzManagementEndPoints.login }).as("postLogin");
    });

    it("Login as Manager", () => {
      login(adminLogin);

      cy.wait("@postLogin").then((xhr) => {
        cy.url().should("include", QuizzManagementEndPoints.manager);

        expect(xhr.request.body).to.include({
          email: adminLogin.email,
          password: adminLogin.password,
        });
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });

        cy.getCookie("authToken")
          .should("exist")
          .and((cookie) => {
            expect(cookie.value).to.not.be.empty;
          });
      });
    });

    it("Login as User", () => {
      login(userLogin);

      cy.wait("@postLogin").then((xhr) => {
        cy.url().should("include", QuizzManagementEndPoints.user);

        expect(xhr.request.body).to.include({
          email: userLogin.email,
          password: userLogin.password,
        });
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });

        UserPage.quizzesSection().should("be.visible");
        UserPage.quizzesSectionTitle().should("be.visible").and("contain.text", "Available Quizzes");
      });
    });

    it("Login Negative case", () => {
      const loginNegativeCase: UserManagementModels.Login = {
        email: "wrong@email.com",
        password: "wrongPassword",
      };

      login(loginNegativeCase);

      CommonPage.toast()
        .should("be.visible")
        .then(($toast) => {
          expect($toast.text().trim()).to.equal("Login failed: Invalid credentials");
        });
    });

    it("Logout Test", () => {
      login(adminLogin);
      CommonPage.logoutBtn().click();
      cy.getCookie("authToken").should("not.exist");
    });
  });

  context("Not Authorized Access Suite", () => {
    it("Redirect when Not Authorized", () => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit("/manager.html");
      cy.url().should("include", "/login");
    });
  });
});
