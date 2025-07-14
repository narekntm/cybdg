import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { UserCredentials } from "Models/Arthur/QuizManager/QuizManagerModels";

export function loginViaApi(user: UserCredentials): Cypress.Chainable {
  return cy
    .request({
      method: "POST",
      url: QuizManagerEndpoints.login,
      body: {
        email: user.email,
        password: user.password,
      },
    })
    .then((res) => {
      const setCookieHeader = res.headers["set-cookie"];
      expect(setCookieHeader, "Set-Cookie header should exist").to.exist;

      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

      const authTokenCookie = cookies.find((c) => c.includes("authToken"));
      expect(authTokenCookie, "authToken cookie should be present").to.exist;

      const token = authTokenCookie.split(";")[0].split("=")[1];
      cy.setCookie("authToken", token);
    });
}

export function logoutViaApi(): Cypress.Chainable {
  return cy
    .request({
      method: "POST",
      url: QuizManagerEndpoints.logout,
    })
    .then(() => {
      cy.clearCookie("authToken");
    });
}

export function clearAuth(): void {
  cy.clearCookie("authToken");
}
