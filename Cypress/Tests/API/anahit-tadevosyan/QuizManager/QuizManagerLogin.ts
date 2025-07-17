import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";

describe("Login test cases", () => {
  const managerEmail = Cypress.env("MANAGER_EMAIL");
  const managerPassword = Cypress.env("MANAGER_PASSWORD");
  const user1Email = Cypress.env("USER1_EMAIL");
  const user1Password = Cypress.env("USER1_PASSWORD");
  const user2Email = Cypress.env("USER2_EMAIL");
  const user2Password = Cypress.env("USER2_PASSWORD");

  const invalidEmail = "user3@example.com";
  const invalidPassword = "user12345";

  beforeEach(() => {
    QuizManagerBuilders.getCurrentUser(false).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.include({ error: "Unauthorized" });
    });
  });

  describe("positive login test cases", () => {
    afterEach(() => {
      QuizManagerBuilders.logout().then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("Enters Admin login details", () => {
      QuizManagerBuilders.login(managerEmail, managerPassword).then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.email).to.eq(managerEmail);
      });
    });

    it("Enters User1 login details", () => {
      QuizManagerBuilders.login(user1Email, user1Password).then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.email).to.eq(user1Email);
      });
    });

    it("Enters User2 login details", () => {
      QuizManagerBuilders.login(user2Email, user2Password).then((response) => {
        expect(response.status).to.eq(200);
      });

      QuizManagerBuilders.getCurrentUser().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.email).to.eq(user2Email);
      });
    });
  });

  describe("negative login test cases", () => {
    it("Enters invalid email address", () => {
      QuizManagerBuilders.login(invalidEmail, managerPassword, false).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.include({ error: "Invalid credentials" });
      });
    });

    it("Enters invalid password", () => {
      QuizManagerBuilders.login(user1Email, invalidPassword, false).then((response) => {
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
      QuizManagerBuilders.login(user2Email, user2Password).then((response) => {
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
      QuizManagerBuilders.login(user2Email, invalidPassword, false).then((response) => {
        expect(response.status).to.eq(401);
      });

      QuizManagerBuilders.logout(false).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
