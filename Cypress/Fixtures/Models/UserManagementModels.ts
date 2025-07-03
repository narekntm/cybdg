export namespace UserManagementModels {
  export enum Columns {
    Name = 0,
    Role = 1,
    Age = 2,
    Email = 3,
    Gender = 4,
    Subscription = 5,
    Status = 6,
    Actions = 7,
  }

  export enum ColumnNames {
    Name = "Name",
    Role = "Role",
    Age = "Age",
    Email = "Email",
    Gender = "Gender",
    Subscription = "Subscription",
    Status = "Status",
    Actions = "Actions",
  }

  export enum UserRole {
    Admin = "Admin",
    Editor = "Editor",
    Viewer = "Viewer",
  }

  export enum ActionButtons {
    Edit = "Edit",
    Delete = "Delete",
    Status = "Status",
    View = "View",
  }

  export enum ButtonAction {
    "Activate" = "Activate",
    "Deactivate" = "Deactivate",
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

  export interface User {
    name: string;
    role: UserRole;
    age: number;
    email: string;
    gender: Gender;
    subscriptions: Subscription[];
  }

  export interface UserDetails extends User {
    id: number;
    status: string;
  }

  export type UserInput = Omit<UserDetails, "id" | "status">;

  export type UserUpdate = Partial<UserInput>;

  export interface Login {
    email: string;
    password: string;
  }
}
