export interface QuizCreation {
  title: string;
  description: string;
  question: string;
  type: OptionType;
  assignTo: AssignTo;
}
export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
}
export enum WrongCredentials {
  email = "wrongEmail@test.com",
  password = "wrongPassword",
}
export enum Role {
  Manager = "manager",
  User = "user",
}
export enum OptionType {
  input = "Input",
  radio = "Radio",
  checkbox = "Checkbox",
  dropdown = "Dropdown",
}
export enum AssignTo {
  allUsers = "All Users",
  selectedUsers = "Selected Users",
}
