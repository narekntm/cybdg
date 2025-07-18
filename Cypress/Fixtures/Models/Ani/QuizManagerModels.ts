export interface QuizCreation {
  title: string;
  description: string;
  question: string;
  type: Type;
  assignTo: AssignTo;
}
export enum HeaderTitles{
  managerDashboardHeaderTitle = "Manager Dashboard: manager1",
  managerSubmissionHeaderTitle = "Quizz Submissions",
}
export enum Type {
  input = "Input",
  radio = "Radio",
  checkbox = "Checkbox",
  dropdown = "Dropdown",
}
export enum AssignTo {
  allUsers = "All Users",
  selectedUsers = "Selected Users",
}