import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementBuilders";
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
        expect(response.body).to.include({
          name: "Anahit",
          role: "Editor",
          age: "26",
          email: "anahit.ru@gamil.com",
          gender: "Female",
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
        expect(response.body).to.include({ error: "Missing fields" });
      });
    });
    it("Add a user with empty fields", () => {
      const invalidEmailUser: UserData = {
        name: "",
        role: "",
        age: "",
        email: "",
        gender: '',
        subscriptions: [],
      };
      UserManagementBuilders.AddUser(invalidEmailUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.include({
          name: "Anahit",
          role: "Editor",
          age: "26",
          email: "anahit",
          gender: "Female",
        });
      });
    });
    it("Add a user with invalid age", () => {
      const invalidEmailUser: UserData = {
        name: "Anahit",
        role: "Editor",
        age: "266",
        email: "anahit",
        gender: "Female",
        subscriptions: ["Newsletter"],
      };
      UserManagementBuilders.AddUser(invalidEmailUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.include({
          name: "Anahit",
          role: "Editor",
          age: "266",
          email: "anahit",
          gender: "Female",
        });
      });
    });

    it("Add a user with invalid name", () => {
      const invalidEmailUser: UserData = {
        name: "Anahittttttttttttttttt",
        role: "Editor",
        age: "266",
        email: "anahit",
        gender: "Female",
        subscriptions: ["Newsletter"],
      };
      UserManagementBuilders.AddUser(invalidEmailUser).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.include({
          name: "Anahittttttttttttttttt",
          role: "Editor",
          age: "26",
          email: "anahit.ru@gmail.com",
          gender: "Female",
        });
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
        expect(response.body).to.include({
          name: "Anahit",
          role: "Editor",
          age: "266",
          email: "anahit",
          gender: "",
        });
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
        expect(response.body).to.include({
          name: "Agness",
          role: "Admin",
          age: "23",
          email: "agness@gamil.com",
          gender: "Other",
        });
      });
    });
  });
});
