import { UserFormInput } from "Models/UserManagementModels";

export function getUserFormInput(user: UserFormInput): UserFormInput {
  return user;
}
export const adminEmail: string = "admin@example.com";
export const adminPassword: string = "admin123";
export const managerEmail: string = "manager@quizz.com";
export const managerPassword: string = "manager123";
export const wrongPassword: string = "wrongPass";
export const wrongEmail: string = "wrong@email.com";
export const wrongFormatEmail: string = "wrongEmail-format";
