import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementV2Builders";
import { Gender, Role, Status, Subscription, UserDataFromView } from "Models/Anahit Tadevosyan/UserManagementV2Model";
import {UserManagementGenerator} from "Generators/Anahit_Tadevosyan/UserManagementV2Generators";

describe("User Management API Testing", () => {
  const baseUrl = "http://127.0.0.1:3000/";

  beforeEach(() => {
    cy.visit(baseUrl);
  });
  afterEach(() => {
    UserManagementBuilders.ResetData();
  });
  describe("View User Page", () => {
    it("Click on the view and redirect to User Page", () => {
      UserManagementBuilders.GetUsers().then((response) => {
        const user = response.body[1];
        expect(user).to.have.property("id");
        cy.log("Second user:", JSON.stringify(user));

        UserManagementBuilders.GetUserById(user.id).then((response) => {
          cy.log("Single user:", JSON.stringify(response.body));
          expect(response.body).to.deep.eq(user);
        });
      });
    });
    it("Click on Edit button and Save with Valid details", () => {
      UserManagementBuilders.GetUserById(2).then((response) => {
        const initialUser = response.body[0];
        const editedUser: UserDataFromView = UserManagementGenerator.userFormPositiveCase;
        UserManagementBuilders.EditUser(2, editedUser).then((response) => {
          expect(response.body).to.include(editedUser);
        });
        UserManagementBuilders.GetUsers().then((response) => {
          expect(response.status).to.equal(304);
          expect(response.body[0]).to.deep.eq(editedUser);
        });
      });
    });

    it("Input invalid user email details", () => {
      UserManagementBuilders.GetUserById(2).then((response) => {
        const initialUser = response.body[0];
        const editedUser: UserDataFromView = UserManagementGenerator.userFormNegativeEmail;
        UserManagementBuilders.EditUser(2, editedUser).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.eq({ errors: ["Valid email is required."] });
        });
      });
    });
    it("Input invalid user age details", () => {
      UserManagementBuilders.GetUserById(2).then((response) => {
        const initialUser = response.body[0];
        const editedUser: UserDataFromView = UserManagementGenerator.userFormNegativeAge;
        UserManagementBuilders.EditUser(2, editedUser).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.eq({ errors: ["Age must be between 1 and 99."] });
        });
      });
    });
    it("Input invalid user name details", () => {
      UserManagementBuilders.GetUserById(2).then((response) => {
        const initialUser = response.body[0];
        const editedUser: UserDataFromView = UserManagementGenerator.userFormNegativeName;
        UserManagementBuilders.EditUser(2, editedUser).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.eq({ errors: ["Name must be 1–20 letters only (no spaces or symbols)."] });
        });
      });
    });
    it("Input empty details", () => {
      UserManagementBuilders.GetUserById(2).then((response) => {
        const initialUser = response.body[0];
        const editedUser: UserDataFromView = UserManagementGenerator.userFormEmptyDetails;
        UserManagementBuilders.EditUser(2, editedUser).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.eq({
            errors: ["Name must be 1–20 letters only (no spaces or symbols).", "Age must be between 1 and 99.", "Valid email is required."],
          });
        });
      });
    });
  });
});
