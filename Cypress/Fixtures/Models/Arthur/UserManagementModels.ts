export interface UserFormData {
  name: string;
  role: string;
  age: string;
  email: string;
  gender: string;
  subscriptions?: string[];
}

export interface UserFormDataMock {
  name: string;
  role: string;
  age: string;
  email: string;
  gender: string;
  subscriptions?: string;
  status: string;
}

export enum Role {
  Admin = "Admin",
  Editor = "Editor",
  Viewer = "Viewer",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum Subscription {
  Newsletter = "Newsletter",
  ProductUpdates = "Product Updates",
}

export enum Status {
  Active = "Active",
  Inactive = "Inactive",
}

export interface UserInput {
  name: string;
  role: Role;
  age: number;
  email: string;
  gender: Gender;
  subscriptions: Subscription[];
  status: Status;
}

export enum UserErrorMessages {
  EmptyName = "Name must be 1–20 letters only (no spaces or symbols).",
  EmptyRole = "Role is required.",
  InvalidAge = "Age must be between 1 and 99.",
  InvalidEmail = "Valid email is required.",
  EmptyGender = "Gender selection is required.",
  UserNotFound = "User not found.",
  InvalidCredentials = "Invalid credentials.",
  AdminDeleteError = "Admin login required to delete Admin-level users.",
  ExistingEmail = "Email already exists.",
}

export enum UserStatusMessages {
  LoggedInAsAdmin = "Logged in as Admin",
  AddNewUserMessage = "User added successfully",
  UpdatedUser = "User updated!",
  UpdatedUserMainPage = "User updated successfully",
}

export interface User extends UserInput {
  id: number;
}
