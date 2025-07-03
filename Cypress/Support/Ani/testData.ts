import { UserFormInput } from "Models/UserManagementModels";

export function getUserFormInput(user: UserFormInput): UserFormInput {
  return user;
}
export const adminEmail: string = "admin@example.com";
export const adminPassword: string = "admin123";
export const wrongPassword: string = "wrongPass";
export const wrongEmail: string = "wrong@email.com";
export const wrongFormatEmail: string = "wrongEmail-format";
export const emptyString: string = "";
export const emptySpace: string = " ";
