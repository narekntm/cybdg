import { UserManagementBuildersV2 } from "Builders/UserManagementBuildersV2";
import { UserManagementGenerators } from "Generators/UserManagementGenerators";
import { UserManagementModels } from "Models/UserManagementModels";

describe("User Management Suite", () => {
  const baseURL = "/";

  before(() => {});

  beforeEach(() => {
    cy.visit(baseURL);
  });

  afterEach(() => {
    //UserManagementBuildersV2.resetData();
  });

  context("Admin Login Suite", () => {
    it("Login as Admin, Positive case", () => {
      UserManagementBuildersV2.adminLogin(UserManagementGenerators.loginPositiveCase()).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Login as Admin, Negative case", () => {
      UserManagementBuildersV2.adminLogin(UserManagementGenerators.loginNegativeCase()).then((responce) => {
        expect(responce.status).to.eq(401);
        expect(responce.statusText).to.eq("Unauthorized");
      });
    });
  });

  context("Add New User Suite", () => {
    it("Add a user, Positive case, submit", () => {
      UserManagementBuildersV2.postUser(UserManagementGenerators.userFormPositiveCase()).then((responce) => {
        console.log("responce: ", responce);
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Add an empty user", () => {
      UserManagementBuildersV2.postUser(UserManagementGenerators.userFormNegativeName()).then((responce) => {
        expect(responce.status).to.eq(400);
      });
    });
  });

  context("User Management Editing Suite", () => {
    it("User table first row edit", () => {
      UserManagementBuildersV2.getUsers().then((responce) => {
        expect(responce.status).to.eq(200);

        const id: number = responce.body[0].id;
        const user = responce.body[0];
        user.name = "NewName";
        user.age = 35;

        UserManagementBuildersV2.putUser(id, user).then((responce) => {
          expect(responce.status).to.eq(200);
          expect(responce.statusText).to.eq("OK");
        });
      });
    });
  });

  context("User Management Delete Suite", () => {
    it("User table first row delete and confirm", () => {
      UserManagementBuildersV2.deleteUser(2, false).then((responce) => {
        expect(responce.status).to.eq(200);

        UserManagementBuildersV2.getUsers().then((responce) => {
          expect(responce.status).to.eq(200);
        });
      });
    });
  });

  context("User Management Status Toggle Suite", () => {
    it("User table first row toggle activate", () => {
      UserManagementBuildersV2.patchUser(1, UserManagementModels.ButtonAction.Deactivate).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });
  });

  context("User Management View Suite", () => {
    it("Edit view", () => {
      UserManagementBuildersV2.getUsers().then((responce) => {
        expect(responce.status).to.be.oneOf([200, 304]);
      });
    });

    it("Edit view, save", () => {
      UserManagementBuildersV2.getUsers().then((responce) => {
        expect(responce.status).to.be.oneOf([200, 304]);
        const id: number = responce.body[0].id;
        const user = responce.body[0];
        user.name = "NewName";
        user.age = 35;

        UserManagementBuildersV2.putUser(id, user).then((responce) => {
          expect(responce.status).to.eq(200);
          expect(responce.statusText).to.eq("OK");
        });
      });
    });
  });

  context("Reset data Suite", () => {
    it("Reset data test", () => {
      UserManagementBuildersV2.resetData().then((responce) => {
        expect(responce.status).to.eq(200);
      });
    });
  });

  context("Seed data and pagination Suite", () => {
    it("Seed data and verify pagination", () => {
      const users: UserManagementModels.UserInput[] = UserManagementGenerators.seedUserData();

      UserManagementBuildersV2.seedData(users).then((responce) => {
        expect(responce.status).to.eq(200);
      });
    });
  });
});
