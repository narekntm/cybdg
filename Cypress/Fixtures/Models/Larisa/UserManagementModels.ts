export namespace UserManagementModels {

  export enum UserRole {
    Manager = "manager",
    User = "user"
  }

  export interface User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
  }

  export interface Login {
    email: string;
    password: string;
  }
}
