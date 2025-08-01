import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { managerUser, regularUser1, setupTestUsers } from "Helpers/QuizManagerSetup";

describe("Login test cases", () => {
  const invalidEmail = "user3@example.com";
  const invalidPassword = "user12345";

  before(() => {
    setupTestUsers();
  });

  describe("positive login test cases", () => {
    afterEach(() => {
      QuizManagerBuilders.logout().then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("Enters Admin login details", () => {
      console.log("managaer test uawee:", managerUser.email, managerUser.password);
      QuizManagerBuilders.login(managerUser.email, managerUser.password).then((response) => {
        console.log("managaer test uawee:", managerUser.email, managerUser.password);
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.email).to.eq(managerUser.email);
      });
    });

    it("Enters User1 login details", () => {
      QuizManagerBuilders.login(regularUser1.email, regularUser1.password).then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.email).to.eq(regularUser1.email);
      });
    });
  });

  describe("negative login test cases", () => {
    it("Enters invalid email address", () => {
      QuizManagerBuilders.login(invalidEmail, managerUser.password, false).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.include({ error: "Invalid credentials" });
      });
    });

    it("Enters invalid password", () => {
      QuizManagerBuilders.login(regularUser1.email, invalidPassword, false).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.include({ error: "Invalid credentials" });
      });
    });

    it("Enters invalid email and password", () => {
      QuizManagerBuilders.login(invalidEmail, invalidPassword, false).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.include({ error: "Invalid credentials" });
      });
    });
  });

  describe("logout test cases", () => {
    it("Logout when logged in", () => {
      QuizManagerBuilders.login(regularUser1.email, regularUser1.password).then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.logout().then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.getCurrentUser(false).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it("Logout when not logged in", () => {
      QuizManagerBuilders.login(regularUser1.email, invalidPassword, false).then((response) => {
        expect(response.status).to.eq(401);
      });

      QuizManagerBuilders.logout(false).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
