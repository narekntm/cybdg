export enum UserTableColumn {
  Name = 0,
  Role = 1,
  Age = 2,
  Email = 3,
  Gender = 4,
  Subscription = 5,
  Status = 6,
  Actions = 7,
}

export enum UserTableActions {
  Edit = "Edit",
  Delete = "Delete",
  Deactivate = "Deactivate",
  Activate = "Activate",
}

export interface UserData {
  name: string;
  role: string;
  age: number;
  email: string;
  gender: "Male" | "Female" | "Other";
  subscriptions?: string[];
}

export interface Login {
  adminEmail: string;
}
