import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementV2Builders";
import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementV2EndPoints";
import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementV2Page";

describe("User Management API Testing", () => {
  const baseUrl = "http://127.0.0.1:3000/";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  describe("Login as admin", () => {
    it("Valid Credentials", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.eq({ success: true });
      });
    });
    it("Valid Email and Invalid Password", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123456").then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.deep.eq({ errors: ["Invalid credentials."] });
      });
    });
    it("Invalid Email and Valid Password", () => {
      UserManagementBuilders.AdminLogin("nonadmin@example.com", "admin123456").then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.deep.eq({ errors: ["Invalid credentials."] });
      });
    });
    it("Empty Credentials", () => {
      UserManagementBuilders.AdminLogin("", "").then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.deep.eq({ errors: ["Invalid credentials."] });
      });
    });
    it("Empty Email and Valid password", () => {
      UserManagementBuilders.AdminLogin("", "admin123").then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.deep.eq({ errors: ["Invalid credentials."] });
      });
    });
    it("Valid Email and empty password", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "").then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.deep.eq({ errors: ["Invalid credentials."] });
      });
    });
  });
});
