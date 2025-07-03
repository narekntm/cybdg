import { UserManagementBuilders } from "Cypress/Fixtures/Builders/UserManagementBuilders";
import { UserManagementEndPoints } from "Cypress/Fixtures/EndPoints/UserManagementEndPoints";
import { UserManagementModels } from "Cypress/Fixtures/Models/UserManagementModels";
import { UserManagementPage } from "Cypress/Fixtures/UserManagementPage";

describe("User Management Suite", () => {
  let loginPositiveCase: UserManagementModels.Login;
  let loginNegativeCase: UserManagementModels.Login;
  let userFormPositiveCase: UserManagementModels.User;
  let userFormNegativeCase: UserManagementModels.User;

  function adminLogin(login: UserManagementModels.Login) {
    if (login.email !== "") {
      UserManagementPage.adminTitle().should("have.text", "Login as Admin");
      UserManagementPage.adminEmailLbl().should("have.text", "Email");
      UserManagementPage.adminEmailInput().should("have.attr", "required");
      UserManagementPage.adminEmailInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.adminEmailInput().type(login.email);
    }

    if (login.password !== "") {
      UserManagementPage.adminPasswordLbl().should("have.text", "Password");
      UserManagementPage.adminPasswordInput().should("have.attr", "required");
      UserManagementPage.adminPasswordInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.adminPasswordInput().type(login.password);
    }

    UserManagementPage.adminSubmitBtn().should("have.text", "Login").click();
  }

  function fillUserForm(user: UserManagementModels.User) {
    if (user.name) {
      UserManagementPage.formNewUserTitle().should("have.text", "Add New User");
      UserManagementPage.fullNameLbl().should("have.text", "Full Name");
      UserManagementPage.fullNameInput().should("have.attr", "required");
      UserManagementPage.fullNameInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.fullNameInput().type(user.name);
    }

    if (user.role) {
      UserManagementPage.roleLbl().should("have.text", "Role");
      UserManagementPage.roleSelect().should("have.attr", "required");
      UserManagementPage.roleSelect().should("be.visible").and("be.enabled").select("Select");
      UserManagementPage.roleSelect().select(user.role);
    }

    if (user.age) {
      UserManagementPage.ageLbl().should("have.text", "Age");
      UserManagementPage.ageInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.ageInput().type(user.age.toString());
    }

    if (user.email) {
      UserManagementPage.emailLbl().should("have.text", "Email");
      UserManagementPage.emailInput().should("have.attr", "required");
      UserManagementPage.emailInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.emailInput().type(user.email);
    }

    if (user.gender) {
      UserManagementPage.genderTitle().should("have.text", "Gender");
      UserManagementPage.genderInput(user.gender).check();
    }

    UserManagementPage.subscribeTitle().should("have.text", "Subscribe to");
    user.subscriptions.forEach((value) => {
      UserManagementPage.subscriptionInput(value).check();
    });

    UserManagementPage.userFormSubmitBtn().should("have.text", "Save");
  }

  const baseURL = "/";

  before(() => {
    cy.fixture("userData").then((data) => {
      loginPositiveCase = data.loginPositiveCase;
      loginNegativeCase = data.loginNegativeCase;
      userFormPositiveCase = data.userFormPositiveCase;
      userFormNegativeCase = data.userFormNegativeCase;
    });
  });

  beforeEach(() => {
    cy.visit(baseURL);
  });

  afterEach(() => {
    UserManagementBuilders.ResetData();
  });

  context("Admin Login Suite", () => {
    it("Login as Admin, Positive case", () => {
      UserManagementBuilders.AdminLogin(loginPositiveCase).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Login as Admin, Negative case", () => {
      UserManagementBuilders.AdminLogin(loginNegativeCase).then((responce) => {
        expect(responce.status).to.eq(401);
        expect(responce.statusText).to.eq("Unauthorized");
      });
    });
  });

  context("User Management Adding Suite", () => {
    it("Add a user, Positive case", () => {
      UserManagementBuilders.PostUser(userFormPositiveCase).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Add an empty user", () => {
      UserManagementBuilders.PostUser(userFormNegativeCase).then((responce) => {
        expect(responce.status).to.eq(400);
      });
    });
  });

  context("User Management Editing/Deleting Suite", () => {
    it("User table first row edit", () => {
      UserManagementBuilders.GetUsers().then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.body).to.be.an("array").with.length(3);
        const id: number = responce.body[0].id;
        const user = responce.body[0];
        user.name = "NewName";
        user.age = 35;

        UserManagementBuilders.PutUser(id, user).then((responce) => {
          expect(responce.status).to.eq(200);
          expect(responce.statusText).to.eq("OK");
        });
      });
    });

    it("User table first row delete and confirm", () => {
      UserManagementBuilders.DeleteUser(2, false).then((responce) => {
        expect(responce.status).to.eq(200);

        UserManagementBuilders.GetUsers().then((responce) => {
          expect(responce.status).to.eq(200);
          expect(responce.body).to.be.an("array").with.length(2);
        });
      });
    });
  });

  context("User Management Status Toggle Suite", () => {
    it("User table first row toggle activate", () => {
      UserManagementBuilders.PatchUser(1, UserManagementModels.ButtonAction.Deactivate).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });
  });
});
