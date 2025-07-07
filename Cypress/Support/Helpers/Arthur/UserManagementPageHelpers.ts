import { Subscription, UserFormData } from "Models/Arthur/UserManagementModels";
import { UserManagementPage } from "Pages/Arthur/UserManagementPageV3";

interface FillUserFormOptions {
  isEdit?: boolean;
}

export function fillUserForm(user: UserFormData, options: FillUserFormOptions = {}) {
  const { isEdit = false } = options;

  UserManagementPage.userNameInput().clear().type(user.name);
  UserManagementPage.userRoleSelect().select(user.role);
  UserManagementPage.userAgeInput().clear().type(user.age);
  UserManagementPage.userEmailInput().clear().type(user.email);

  if (user.gender && user.gender.trim()) {
    UserManagementPage.userGenderRadio(user.gender).check();
  }

  if (isEdit) {
    UserManagementPage.productCheckbox().check();
  }

  const allSubscriptions = [Subscription.Newsletter, Subscription.ProductUpdates];
  allSubscriptions.forEach((sub) => {
    UserManagementPage.userSubscriptionCheckbox(sub).uncheck({ force: true });
  });

  user.subscriptions?.forEach((sub) => {
    UserManagementPage.userSubscriptionCheckbox(sub).check({ force: true });
  });
}
