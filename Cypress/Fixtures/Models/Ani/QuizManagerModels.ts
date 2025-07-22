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
export enum Role {
  Manager = "manager",
  User = "user",
}
export enum HeaderTitles {
  managerDashboardHeaderTitle = "Manager Dashboard: manager1",
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
