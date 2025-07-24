import { QuizzManagementBuilders } from "Builders/Larisa/QuizzManagementBuilders";
import { adminLogin, baseURL, login, manager, user, userLogin } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { UserManagementModels } from "Models/Larisa/UserManagementModels";
import { CommonPage } from "Pages/Larisa/CommonPage";
import { QuizzLoginPage } from "Pages/Larisa/QuizzLoginPage";
import { QuizzManagerPage } from "Pages/Larisa/QuizzManagerPage";
import { UserPage } from "Pages/Larisa/UserPage";

describe("Quizz Authorization Suite", () => {
  const loginNegativeCase: UserManagementModels.Login = {
    email: "wrong@email.com",
    password: "wrongPassword",
  };

  before(() => {
    QuizzManagementBuilders.authMe().then((responce) => {
      expect(responce.status).to.eq(401);
      expect(responce.statusText).to.eq("Unauthorized");
    });

    QuizzManagementBuilders.auth().then((responce) => {
      cy.setCookie("authToken", responce.body.token);
    });

    QuizzManagementBuilders.postUser(manager).then((responce) => {
      expect(responce.status).to.be.oneOf([200, 201]);
      expect(responce.statusText).to.eq("Created");
    });

    QuizzManagementBuilders.postUser(user).then((responce) => {
      expect(responce.status).to.be.oneOf([200, 201]);
      expect(responce.statusText).to.eq("Created");
    });
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(baseURL);

    cy.intercept({ method: "POST", url: QuizzManagementEndPoints.login }).as("postLogin");
  });

  context("Login Page UI Suite", () => {
    it("Login Modal Content Test", () => {
      QuizzLoginPage.title().should("be.visible").and("have.text", "Login to Quizz Manager");
      QuizzLoginPage.emailLbl().should("be.visible").and("contain.text", "Email");
      QuizzLoginPage.emailInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzLoginPage.passwordLbl().should("be.visible").and("contain.text", "Password");
      QuizzLoginPage.passwordInput().should("be.visible").and("be.enabled").and("have.attr", "required");
      QuizzLoginPage.submitBtn().should("be.visible").and("contain.text", "Login");
    });
  });

  context("Login to Quizz AS Manager Suite", () => {
    beforeEach(() => {
      login(adminLogin);
    });

    it("Login as Manager, Positive case", () => {
      cy.wait("@postLogin").then((xhr) => {
        expect(xhr.request.body).to.include({
          email: adminLogin.email,
          password: adminLogin.password,
        });
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });
      });
    });

    it("Login as Manager, Positive case, validate cookie", () => {
      cy.getCookie("authToken")
        .should("exist")
        .and((cookie) => {
          expect(cookie.value).to.not.be.empty;
        });
    });
  });

  context("Login to Quizz AS User Suite", () => {
    it("Login as User1, Positive case", () => {
      login(userLogin);
      cy.wait("@postLogin").then((xhr) => {
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
  });

  context("Login to Quizz Negative Case Suite", () => {
    it("Login, Negative case", () => {
      login(loginNegativeCase);
      CommonPage.toast()
        .should("be.visible")
        .then(($toast) => {
          expect($toast.text().trim()).to.equal("Login failed: Invalid credentials");
        });
    });
  });

  context("Logout Suite", () => {
    it("Logout Test", () => {
      login(adminLogin);
      QuizzManagerPage.logoutBtn().click();
      cy.getCookie("authToken").should("not.exist");
    });
  });
});
