import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementV2Page";
export enum userTableColumn {
  Name = 0,
  Role = 1,
  Age = 2,
  Email = 3,
  Gender = 4,
  Subscription = 5,
  Status = 6,
  Actions = 7,
}

export enum userTableActions {
  Edit = "Edit",
  Delete = "Delete",
  Deactivate = "Deactivate",
  Activate = "Activate",
}

export interface UserData {
  name: string;
  role: Role;
  age: string;
  email: string;
  gender: Gender;
  subscriptions: Subscription[];
}

export interface UserDataFromView extends UserData{
  status: Status;
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
export interface Login {
  adminEmail: string;
  password: string;
}
