import { UserManagementBuilders } from "Cypress/Fixtures/Builders/UserManagementBuilders";
import { UserManagementModels } from "Cypress/Fixtures/Models/UserManagementModels";

describe("User Management Suite", () => {
  let loginPositiveCase: UserManagementModels.Login;
  let loginNegativeCase: UserManagementModels.Login;
  let userFormPositiveCase: UserManagementModels.User;
  let userFormNegativeCase: UserManagementModels.User;

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
    UserManagementBuilders.resetData();
  });

  context("Admin Login Suite", () => {
    it("Login as Admin, Positive case", () => {
      UserManagementBuilders.adminLogin(loginPositiveCase).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Login as Admin, Negative case", () => {
      UserManagementBuilders.adminLogin(loginNegativeCase).then((responce) => {
        expect(responce.status).to.eq(401);
        expect(responce.statusText).to.eq("Unauthorized");
      });
    });
  });

  context("User Management Adding Suite", () => {
    it("Add a user, Positive case", () => {
      UserManagementBuilders.postUser(userFormPositiveCase).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Add an empty user", () => {
      UserManagementBuilders.postUser(userFormNegativeCase).then((responce) => {
        expect(responce.status).to.eq(400);
      });
    });
  });

  context("User Management Editing/Deleting Suite", () => {
    it("User table first row edit", () => {
      UserManagementBuilders.getUsers().then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.body).to.be.an("array").with.length(3);
        const id: number = responce.body[0].id;
        const user = responce.body[0];
        user.name = "NewName";
        user.age = 35;

        UserManagementBuilders.putUser(id, user).then((responce) => {
          expect(responce.status).to.eq(200);
          expect(responce.statusText).to.eq("OK");
        });
      });
    });

    it("User table first row delete and confirm", () => {
      UserManagementBuilders.deleteUser(2, false).then((responce) => {
        expect(responce.status).to.eq(200);

        UserManagementBuilders.getUsers().then((responce) => {
          expect(responce.status).to.eq(200);
          expect(responce.body).to.be.an("array").with.length(2);
        });
      });
    });
  });

  context("User Management Status Toggle Suite", () => {
    it("User table first row toggle activate", () => {
      UserManagementBuilders.patchUser(1, UserManagementModels.ButtonAction.Deactivate).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });
  });
});
