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
export enum UserTableColumns {
  name = "Name",
  role = "Role",
  age = "Age",
  email = "Email",
  gender = "Gender",
  subscription = "Subscription",
  status = "Status",
  actions = "Actions",
}
export enum Actions {
  edit = "Edit",
  delete = "Delete",
  activate = "Activate",
  deactivate = "Deactivate",
}
