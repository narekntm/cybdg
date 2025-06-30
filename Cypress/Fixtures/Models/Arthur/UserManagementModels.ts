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
  Promotions = "Promotions",
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
