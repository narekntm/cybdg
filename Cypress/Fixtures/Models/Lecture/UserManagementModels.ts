export namespace UserManagementModels {
  /** Enumerates possible user roles */
  export enum Role {
    Admin = "Admin",
    Editor = "Editor",
    Viewer = "Viewer",
  }

  /** Enumerates possible genders for a user */
  export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other",
  }

  /** Enumerates possible subscription types */
  export enum Subscription {
    Newsletter = "Newsletter",
    ProductUpdates = "Product Updates",
    Promotions = "Promotions",
  }

  /** Enumerates user status */
  export enum Status {
    Active = "Active",
    Inactive = "Inactive",
  }

  /** Represents a user in the system */
  export interface User {
    id ?: number;
    name ?: string;
    role ?: Role;
    age ?: number;
    email ?: string;
    gender ?: Gender;
    subscriptions ?: Subscription[];
    status ?: Status;
  }

  /** Input required to create a new user */
  export type UserInput = Omit<User, "id" | "status">;

  /** Fields allowed to update for a user */
  export type UserUpdate = Partial<UserInput>;

  /** API response for login */
  export interface LoginResponse {
    success: boolean;
    message?: string;
  }

  /** Generic API error response */
  export interface ErrorResponse {
    error: string;
  }

  /** API response returning a list of users */
  export type UserListResponse = User[];

  /** API response for single-user operations (create/update) */
  export type UserResponse = User;

  /** API response for status toggle */
  export interface StatusResponse {
    status: Status;
  }
}
