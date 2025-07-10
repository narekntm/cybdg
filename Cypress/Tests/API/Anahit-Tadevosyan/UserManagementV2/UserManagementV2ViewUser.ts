import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementV2Builders";
import { UserManagementGenerator } from "Generators/Anahit_Tadevosyan/UserManagementV2Generators";
import { UserDataFromView } from "Models/Anahit Tadevosyan/UserManagementV2Model";

describe("User Management API Testing", () => {
  const baseUrl = "http://127.0.0.1:3000/";

  beforeEach(() => {
    cy.visit(baseUrl);
  });
  afterEach(() => {
    UserManagementBuilders.resetData();
  });
  describe("View User Page", () => {
    it("Click on the view and redirect to User Page", () => {
      UserManagementBuilders.getUsers().then((response) => {
        const user = response.body[1];
        expect(user).to.have.property("id");
        cy.log("Second user:", JSON.stringify(user));

        UserManagementBuilders.getUserById(user.id).then((response) => {
          cy.log("Single user:", JSON.stringify(response.body));
          expect(response.body).to.deep.eq(user);
        });
      });
    });
    it("Click on Edit button and Save with Valid details", () => {
      UserManagementBuilders.getUserById(2).then(() => {
        const editedUser: UserDataFromView = UserManagementGenerator.userFormPositiveCase;
        UserManagementBuilders.editUser(2, editedUser).then((response) => {
          expect(response.body).to.include(editedUser);
        });
        UserManagementBuilders.getUsers().then((response) => {
          expect(response.status).to.equal(304);
          expect(response.body[0]).to.deep.eq(editedUser);
        });
      });
    });

    it("Input invalid user email details", () => {
      UserManagementBuilders.getUserById(2).then(() => {
        const editedUser: UserDataFromView = UserManagementGenerator.userFormNegativeEmail;
        UserManagementBuilders.editUser(2, editedUser).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.eq({ errors: ["Valid email is required."] });
        });
      });
    });
    it("Input invalid user age details", () => {
      UserManagementBuilders.getUserById(2).then(() => {
        const editedUser: UserDataFromView = UserManagementGenerator.userFormNegativeAge;
        UserManagementBuilders.editUser(2, editedUser).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.eq({ errors: ["Age must be between 1 and 99."] });
        });
      });
    });
    it("Input invalid user name details", () => {
      UserManagementBuilders.getUserById(2).then(() => {
        const editedUser: UserDataFromView = UserManagementGenerator.userFormNegativeName;
        UserManagementBuilders.editUser(2, editedUser).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.eq({ errors: ["Name must be 1–20 letters only (no spaces or symbols)."] });
        });
      });
    });
    it("Input empty details", () => {
      UserManagementBuilders.getUserById(2).then(() => {
        const editedUser: Partial<UserDataFromView> = UserManagementGenerator.userFormEmptyDetails;
        UserManagementBuilders.editUser(2, editedUser).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.eq({
            errors: ["Name must be 1–20 letters only (no spaces or symbols).", "Age must be between 1 and 99.", "Valid email is required."],
          });
        });
      });
    });
  });
});
