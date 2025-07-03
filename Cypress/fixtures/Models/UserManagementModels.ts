export interface UserFormInput {
  name: string;
  role: Role;
  age: number;
  email: string;
  gender: Gender;
  subscription?: SubscribeTo[];
}
export enum Role {
  admin = "Admin",
  editor = "Editor",
  viewer = "Viewer",
}
export enum Gender {
  male = "Male",
  female = "Female",
  other = "Other",
}
export enum SubscribeTo {
  newsletter = "Newsletter",
  productUpdates = "Product Updates",
}
export enum UserTable {
  userTableTitle = "User Table",
  nameColumn = "Name",
  roleColumn = "Role",
  ageColumn = "Age",
  emailColumn = "Email",
  genderColumn = "Gender",
  subscriptionColumn = "Subscription",
  statusColumn = "Status",
  actionsColumn = "Actions",
}
export enum Actions {
  edit = "Edit",
  delete = "Delete",
  activate = "Activate",
  deactivate = "Deactivate",
}
export enum AdminLoginStatus {
  successTitle = "Logged in as Admin",
  notLoggedInTitle = "Not Logged In",
  errorText = "Invalid credentials.",
}
export enum PageHeaders {
  headerTitle = "User Management – Cypress Sandbox",
  aboutSiteBtnText = "About Site",
}
export enum PageFooter {
  footerText = "© 2025 Cypress Sandbox",
}
export enum ButtonTexts {
  login = "Login",
  logout = "Logout",
  cancel = "Cancel",
  addNewUser = "+ Add New User",
  resetData = "Reset Data",
}
export enum LabelTexts {
  adminEmailLabel = "Email",
  adminPasswordLabel = "Password",
  fullNameLabel = "Full Name",
  role = "Role",
  age = "Age",
  gender = "Gender",
  subscription = "Subscribe to",
}
export enum AdminLoginModal {
  modalTitle = "Admin Login",
}
export enum AddNewUserModal {
  modalTitle = "Add New User",
}
