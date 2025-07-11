import { UserManagementPage } from "Pages/UserManagementPage";
import { SignIn , AdminLoginData, NewUser} from "Models/David Models/UserManagementModels";
export class UserManagementMethods {
  // Auth part
  static Auth = (data:AdminLoginData) => {
    data.email && UserManagementPage.adminEmailInput().type(data.email);
    data.password && UserManagementPage.adminPasswordInput().type(data.password);
    UserManagementPage.adminSubmitButton().click();
  };
  static AuthV2 = (data:AdminLoginData) => {
    UserManagementPage.loginPopUpButton().click()
    data.email && UserManagementPage.adminEmailInput().type(data.email);
    data.password && UserManagementPage.adminPasswordInput().type(data.password);
    UserManagementPage.adminSubmitButtonV2().click();
  }
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
  static fillUserForm = (formData:NewUser) => {
    formData.name && UserManagementPage.nameField().type(formData.name)
    formData.role && UserManagementPage.roleField().select(formData.role)
    formData.age && UserManagementPage.ageField().type(formData.age)
    formData.email && UserManagementPage.emailField().type(formData.email)
    formData.gender && cy.get('input[name="gender"]').check(formData.gender)
    formData.subscribtion && cy.get('input[name="subscribe"]').check(formData.subscribtion)
  }
  static fillUserFormV2 = (formData:NewUser) => {
    UserManagementPage.newUserButtonPopUpOpen().click()
    formData.name && UserManagementPage.nameField().type(formData.name)
    formData.role && UserManagementPage.roleField().select(formData.role)
    formData.age && UserManagementPage.ageField().type(formData.age)
    formData.email && UserManagementPage.emailField().type(formData.email)
    formData.gender && cy.get('input[name="gender"]').check(formData.gender)
    formData.subscribtion && cy.get('input[name="subscribe"]').check(formData.subscribtion)
  }
}
