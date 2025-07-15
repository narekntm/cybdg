import { UserManagementBuilders } from "Builders/David Builders/UserManagementBuilders";

describe("Admin auth tests", () => {
  const login = "admin@example.com";
  const password = "admin123";

  context("Admin negative cases", () => {
    it("Should check wrong admin credentials", () => {
      UserManagementBuilders.AdminLogin("123123@134.ru", "123123").then((xhr) => {
        expect(xhr.status).to.eq(401);
        expect(xhr.body).deep.equal({ errors: ["Invalid credentials."] });
      });
    });
    it("Should check empty fields", () => {
      UserManagementBuilders.AdminLogin("  ", "  ").then((xhr) => {
        expect(xhr.status).to.eq(401);
        expect(xhr.body).deep.equal({ errors: ["Invalid credentials."] });
      });
    });
    it("Should check long email and short password", () => {
      UserManagementBuilders.AdminLogin("1222222222222222231312311313", "m1").then((xhr) => {
        expect(xhr.status).to.eq(401);
        expect(xhr.body).deep.equal({ errors: ["Invalid credentials."] });
      });
    });
    it("Should check empty email filled password", () => {
      UserManagementBuilders.AdminLogin(" ", "12345678").then((xhr) => {
        expect(xhr.status).to.eq(401);
        expect(xhr.body).deep.equal({ errors: ["Invalid credentials."] });
      });
    });
    it("Should check filled email, empty password", () => {
      UserManagementBuilders.AdminLogin("registrated@email.com", " ").then((xhr) => {
        expect(xhr.status).to.eq(401);
        expect(xhr.body).deep.equal({ errors: ["Invalid credentials."] });
      });
    });
  });
  context("Admin positive cases", () => {
    it("Should check success login", () => {
      UserManagementBuilders.AdminLogin(login, password).then((xhr) => {
        expect(xhr.status).to.eq(200);
        expect(xhr.body).deep.equal({ success: true });
      });
    });
  });
});
