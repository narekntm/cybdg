import { UserManagementBuilders } from "Builders/UserManagementBuilders";
import { Gender , Role , SubscribeTo , UserFormInput } from "Models/UserManagementModels";



function getUserFormInput(
  name: string,
  role: Role,
  age: number,
  email: string,
  gender: Gender,
  subscription?: SubscribeTo[]
): UserFormInput {
  return { name: name, role: role, age: age, email: email, gender: gender, subscription: subscription };
}
const adminUser: UserFormInput = getUserFormInput("Admin", Role.admin, 5, "admin@test.test", Gender.other);
const wrongUser: UserFormInput = getUserFormInput("Vie wer", Role.viewer, 500, "com", Gender.male);
describe("User Management", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:3000/");
  });
  describe("Login as Admin", () => {
    it("1. Admin login with valid email and invalid password", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "wrongPass").then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("2. Admin login with valid email and password", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
    });
    it("3. Admin login with invalid email and valid password", () => {
      UserManagementBuilders.AdminLogin("wrong@email.com", "admin123").then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("4. Admin login with invalid format email and valid password", () => {
      UserManagementBuilders.AdminLogin("wrongEmail-format", "admin123").then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("5. Admin login with empty credentials", () => {
      UserManagementBuilders.AdminLogin("", "").then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("6. Admin login with empty email and valid password", () => {
      UserManagementBuilders.AdminLogin("", "admin123").then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("7. Admin login with valid email and empty password", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "").then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
  });
  describe("Add New User", () => {
    it("1. User creation with valid credentials(viewer mode)", () => {
      UserManagementBuilders.GetUsers().then((xhr) => {
        console.log(xhr);
        expect(xhr.body.length).to.eq(3);
      });
      UserManagementBuilders.UserCreate(adminUser).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(4);
      });
    });
    it("2. User creation with valid credentials(logged in)", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        console.log(xhr);
        expect(xhr.body.length).to.eq(3);
      });
      UserManagementBuilders.UserCreate(adminUser).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(4);
      });
    });
    it("3. User creation with invalid credentials(viewer mode)", () => {
      UserManagementBuilders.UserCreate(wrongUser).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
    });
  });
  describe("User Table", () => {
    it("1. Trying to delete a user while being logged in", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        console.log(xhr);
        expect(xhr.body.length).to.eq(3);
        cy.log(JSON.stringify(xhr.body));
      });
      UserManagementBuilders.UserDeleteAsAdmin(1).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        console.log(xhr);
        expect(xhr.body.length).to.eq(2);
      });
    });
    it("2. Trying to delete a user while being logged out", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        console.log(xhr);
        expect(xhr.body.length).to.eq(3);
        cy.log(JSON.stringify(xhr.body));
      });
      UserManagementBuilders.UserDeleteAsViewer(1).then((xhr) => {
        expect(xhr.status).to.eq(403);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        console.log(xhr);
        expect(xhr.body.length).to.eq(3);
      });
    });
    it("3. Status update in a viewer mode", () => {
      UserManagementBuilders.UserUpdate(1).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
    });
    it("4. Status update in Admin mode", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.UserUpdate(1).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
    });
    it("5. User update in a viewer mode", () => {
      UserManagementBuilders.UserUpdate(1).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
    });
    it("6. User update in Admin mode", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.UserUpdate(1).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
    });
  });
  afterEach(() => {
    UserManagementBuilders.ResetData().then((xhr) => {
      expect(xhr.status).to.eq(200);
    });
  });
});
