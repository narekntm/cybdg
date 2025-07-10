import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementBuilders";
import { UserManagementGenerator } from "Generators/Anahit_Tadevosyan/UserManagementV2Generators";
import { UserData } from "Models/Anahit Tadevosyan/UserManagementModel";

describe("User Management API Testing", () => {
  const baseUrl = "http://127.0.0.1:3000/";

  beforeEach(() => {
    cy.visit(baseUrl);
  });
  afterEach(() => {
    UserManagementBuilders.resetData();
  });
  describe("Add new user", () => {
    it("Add a user with valid data", () => {
      const validUser: UserData = UserManagementGenerator.userPositiveCase;
      UserManagementBuilders.addUser(validUser).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({
          ...validUser,
        });
      });
    });
    it("Add a user with invalid mail", () => {
      const invalidEmailUser: UserData = UserManagementGenerator.userNegativeEmail;
      UserManagementBuilders.addUser(invalidEmailUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.eq({ errors: ["Valid email is required."] });
      });
    });
    it("Add a user with empty fields", () => {
      UserManagementBuilders.addUser().then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.eq({
          errors: [
            "Name must be 1–20 letters only (no spaces or symbols).",
            "Role is required.",
            "Age must be between 1 and 99.",
            "Valid email is required.",
            "Gender selection is required.",
          ],
        });
      });
    });
    it("Add a user with invalid age", () => {
      const invalidUser: UserData = UserManagementGenerator.userNegativeAge;
      UserManagementBuilders.addUser(invalidUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.eq({ errors: ["Age must be between 1 and 99."] });
      });
    });

    it("Add a user with invalid name", () => {
      const invalidUser: UserData = UserManagementGenerator.userNegativeName;
      UserManagementBuilders.addUser(invalidUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.eq({ errors: ["Name must be 1–20 letters only (no spaces or symbols)."] });
      });
    });
    it("Add a user with empty gender", () => {
      const invalidUser: UserData = { ...UserManagementGenerator.userPositiveCase, gender: null };
      UserManagementBuilders.addUser(invalidUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.eq({ errors: ["Gender selection is required."] });
      });
    });
    it("Edit a user", () => {
      const editedUser: UserData = UserManagementGenerator.generateRandomUser();
      UserManagementBuilders.editUser(3, editedUser).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include(editedUser);
      });
    });
  });
});
