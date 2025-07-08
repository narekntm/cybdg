import { UserFormData } from "Models/Arthur/UserManagementModels";
import { UserManagementPage } from "Pages/Arthur/UserManagementPageV3";

export function fillUserForm(user: UserFormData) {
  UserManagementPage.userNameInput().clear().type(user.name);
  UserManagementPage.userRoleSelect().select(user.role);
  UserManagementPage.userAgeInput().clear().type(user.age);
  UserManagementPage.userEmailInput().clear().type(user.email);

  if (user.gender && user.gender.trim()) {
    UserManagementPage.userGenderRadio(user.gender).check();
  }

  user.subscriptions?.forEach((sub) => {
    UserManagementPage.userSubscriptionCheckbox(sub).check({ force: true });
  });
}
