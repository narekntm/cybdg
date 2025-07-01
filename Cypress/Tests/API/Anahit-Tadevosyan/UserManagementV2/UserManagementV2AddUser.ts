import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementBuilders";
import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementEndPoints";
import { UserData } from "Models/Anahit Tadevosyan/UserManagementModel";
import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementPage";

describe("User Management API Testing", () => {
  const baseUrl = "http://127.0.0.1:3000/";

  beforeEach(() => {
    cy.visit(baseUrl);
  });
  afterEach(() => {
    UserManagementBuilders.ResetData();
  });
  describe("Add new user", () => {
    it("Add a user with valid data", () => {
      const validUser: UserData = {
        name: "Anahit",
        role: "Editor",
        age: "26",
        email: "anahit.ru@gamil.com",
        gender: "Female",
        subscriptions: ["Newsletter"],
      };
      UserManagementBuilders.AddUser(validUser).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({
          ...validUser,
          subscriptions: validUser.subscriptions[0],
        });
      });
    });
    it("Add a user with invalid mail", () => {
      const invalidEmailUser: UserData = {
        name: "Anahit",
        role: "Editor",
        age: "26",
        email: "anahit",
        gender: "Female",
        subscriptions: ["Newsletter"],
      };
      UserManagementBuilders.AddUser(invalidEmailUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.eq({ errors: ["Valid email is required."] });
      });
    });
    it("Add a user with empty fields", () => {
      const invalidEmailUser: UserData = {
        name: "",
        role: "",
        age: "",
        email: "",
        gender: "",
        subscriptions: [],
      };
      UserManagementBuilders.AddUser(invalidEmailUser).then((response) => {
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
      const invalidEmailUser: UserData = {
        name: "Anahit",
        role: "Editor",
        age: "266",
        email: "anahit@gmail.com",
        gender: "Female",
        subscriptions: ["Newsletter"],
      };
      UserManagementBuilders.AddUser(invalidEmailUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.eq({ errors: ["Age must be between 1 and 99."] });
      });
    });

    it("Add a user with invalid name", () => {
      const invalidEmailUser: UserData = {
        name: "Anahittttttttttttttttt",
        role: "Editor",
        age: "26",
        email: "anahit@gmail.com",
        gender: "Female",
        subscriptions: ["Newsletter"],
      };
      UserManagementBuilders.AddUser(invalidEmailUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.eq({ errors: ["Name must be 1–20 letters only (no spaces or symbols)."] });
      });
    });
    it("Add a user with empty gender", () => {
      const invalidEmailUser: UserData = {
        name: "Anahit",
        role: "Editor",
        age: "26",
        email: "anahit.ru@gmail.com",
        gender: "",
        subscriptions: ["Newsletter"],
      };
      UserManagementBuilders.AddUser(invalidEmailUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.eq({ errors: ["Gender selection is required."] });
      });
    });
    it("Edit a user", () => {
      const validUser: UserData = {
        name: "Anahit",
        role: "Editor",
        age: "26",
        email: "anahit.ru@gamil.com",
        gender: "Female",
        subscriptions: ["Newsletter"],
      };
      const editedUser: UserData = {
        name: "Agness",
        role: "Admin",
        age: "23",
        email: "agness@gamil.com",
        gender: "Other",
        subscriptions: [],
      };
      UserManagementBuilders.EditUser(3, editedUser).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({
          ...validUser,
          subscriptions: validUser.subscriptions[0],
        });
      });
    });
  });
});
