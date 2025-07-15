import { AdminLoginData, NewUser } from "Models/David Models/UserManagementModels";
import { UserManagementPage } from "Pages/David Pages/UserManagementPage";

export class UserManagementMethods {
  // Auth part
  static Auth = (data: AdminLoginData) => {
    if (data.email) {
      UserManagementPage.adminEmailInput().type(data.email);
    }
    if (data.password) {
      UserManagementPage.adminPasswordInput().type(data.password);
    }
    UserManagementPage.adminSubmitButton().click();
  };
  static AuthV2 = (data: AdminLoginData) => {
    UserManagementPage.loginPopUpButton().click();
    if (data.email) {
      UserManagementPage.adminEmailInput().type(data.email);
    }
    if (data.password) {
      UserManagementPage.adminPasswordInput().type(data.password);
    }
    UserManagementPage.adminSubmitButtonV2().click();
  };
  static adminUserDeleteAsAdmin = () => {
    UserManagementPage.userTableFirstDeleteButton().click();
    UserManagementPage.popUpConfirmDeleteButton().click();
    UserManagementPage.userTableRows().should("have.length", 2);
  };
  static logout = () => {
    UserManagementPage.logoutButton().click();
    UserManagementPage.successSignInMessage().should("not.be.visible");
  };
  static logoutV2 = () => {
    UserManagementPage.logoutButtonV2().click();
    UserManagementPage.logoutButtonV2().should("not.be.visible");
  };
  static fillUserForm = (formData: NewUser) => {
    if (formData.name) {
      UserManagementPage.nameField().type(formData.name);
    }
    if (formData.role) {
      UserManagementPage.roleField().select(formData.role);
    }
    if (formData.age) {
      UserManagementPage.ageField().type(formData.age);
    }
    if (formData.email) {
      UserManagementPage.emailField().type(formData.email);
    }
    if (formData.gender) {
      cy.get('input[name="gender"]').check(formData.gender);
    }
    if (formData.subscribtion) {
      cy.get('input[name="subscribe"]').check(formData.subscribtion);
    }
  };
  static fillUserFormV2 = (formData: NewUser) => {
    UserManagementPage.newUserButtonPopUpOpen().click();
    if (formData.name) {
      UserManagementPage.nameField().type(formData.name);
    }
    if (formData.role) {
      UserManagementPage.roleField().select(formData.role);
    }
    if (formData.age) {
      UserManagementPage.ageField().type(formData.age);
    }
    if (formData.email) {
      UserManagementPage.emailField().type(formData.email);
    }
    if (formData.gender) {
      cy.get('input[name="gender"]').check(formData.gender);
    }
    if (formData.subscribtion) {
      cy.get('input[name="subscribe"]').check(formData.subscribtion);
    }
  };
}
