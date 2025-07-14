import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerGenerators } from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import {UserManagementGenerator} from "Generators/anahit-tadevosyan/UserManagementV2Generators";

describe("Login test cases", () => {
  const baseUrl = "/login.html";
  beforeEach(() => {
    cy.visit(baseUrl);
      QuizManagerBuilders.getCurrentUser().then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body).to.include({"error":"Unauthorized"});
      });
  });

  describe("positive login test cases", () => {
    afterEach(() => {
      QuizManagerBuilders.logout().then((response) => {
          expect(response.status).to.eq(200);
      })
    });
    it("Enters Admin logins details", () => {
      QuizManagerBuilders.login(QuizManagerGenerators.adminUser.email, QuizManagerGenerators.adminUser.password).then((response) => {
        expect(response.status).to.eq(200);
      });
      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.eq(QuizManagerGenerators.adminUser);
      });
    });
    it('Enters User1 login details', () => {
        QuizManagerBuilders.login(QuizManagerGenerators.user1WithPassword.email, QuizManagerGenerators.user1WithPassword.password).then((response) => {
            expect(response.status).to.eq(200);
        });
        QuizManagerBuilders.getCurrentUser().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.deep.eq(QuizManagerGenerators.user1WithPassword);
        });
    })
      it('Enters User2 login details', () => {
          QuizManagerBuilders.login(QuizManagerGenerators.user2WithPassword.email, QuizManagerGenerators.user2WithPassword.password).then((response) => {
              expect(response.status).to.eq(200);
          });
          QuizManagerBuilders.getCurrentUser().then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.deep.eq(QuizManagerGenerators.user2WithPassword);
          });
      })
  });
  describe('negative login test cases', () => {
      it('enters invalid email address', () => {
          QuizManagerBuilders.login(QuizManagerGenerators.invalidCredentials.email, QuizManagerGenerators.adminUser.password).then((response) => {
              expect(response.status).to.eq(401);
              expect(response.body).to.include({"error": "Invalid credentials"})
          });
      });
      it('Enters invalid password details', () => {
          QuizManagerBuilders.login(QuizManagerGenerators.user1.email, QuizManagerGenerators.invalidCredentials.password).then((response) => {
              expect(response.status).to.eq(401);
              expect(response.body).to.include({"error": "Invalid credentials"})
          });
      });
      it('Enter invalid email and password', () => {
          it('Enters invalid password details', () => {
              QuizManagerBuilders.login(QuizManagerGenerators.invalidCredentials.email, QuizManagerGenerators.invalidCredentials.password).then((response) => {
                  expect(response.status).to.eq(401);
                  expect(response.body).to.include({"error": "Invalid credentials"})
              });
          });
      })
      describe('logout test cases', () => {
          it('Logout when logged in', () => {
              QuizManagerBuilders.login(QuizManagerGenerators.user2.email, QuizManagerGenerators.user2WithPassword.password).then((response) => {
                  expect(response.status).to.eq(200);
              });
              QuizManagerBuilders.logout().then((response) => {
                  expect(response.status).to.eq(200);
              })
              QuizManagerBuilders.getCurrentUser().then((response) => {
                  expect(response.status).to.eq(401);
              })
          })
          it('Logout when not logged in', () => {
              QuizManagerBuilders.login(QuizManagerGenerators.user2.email, QuizManagerGenerators.invalidCredentials.password).then((response) => {
                  expect(response.status).to.eq(401);
              });
              QuizManagerBuilders.logout().then((response) => {
                  expect(response.status).to.eq(401);
              })

          })
      })
  })
})
