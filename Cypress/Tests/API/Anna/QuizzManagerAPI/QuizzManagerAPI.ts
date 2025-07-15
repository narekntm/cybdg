import { QuizzManagerBuildersBuilders } from "Builders/Anna/QuizzmanagerBuilders/QuizzManagerBuilders";

describe("Quizz-Manager -API ", () => {
  const adminEmail = "admin@example.com";
  const adminPass = "admin123";
  //let createdUserId: number;

  it("POST /api/login succeeds with valid credentials", () => {
    QuizzManagerBuildersBuilders.AdminLogin(adminEmail, adminPass).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("success", true);
    });
  });

  it("POST /api/login fails with invalid credentials", () => {
    QuizzManagerBuildersBuilders.AdminLogin("wrong@admin.com", "badpass").then((resp) => {
      expect(resp.status).to.eq(401);
      expect(resp.body).to.have.property("success", false);
    });
  });

})