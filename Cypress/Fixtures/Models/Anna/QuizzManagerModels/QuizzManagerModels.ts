export namespace QuizzManagerModels {

export interface Newquizz {
  quizzTitle: string,
  quizzDescription: string,
  AddQuestionFields: AddQuestionFields,
}

  export enum SelectInput {
   Input = "Input",
    Radio = "Radio",
    Checkbox = "Checkbox",
    DropDown = "DropDown",
  }

  export enum AssignTo {
    AllUsers = "All Users",
    SelectedUsers = "Selected Users",
  }

  export enum Status {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    DRAFT = "DRAFT"
  }

  export interface StatusResponse {
    status: Status;
  }
  /** API response for login */
  export interface LoginResponse {
    success: boolean;
    message?: string;
  }

  /** Generic API error response */
  export interface ErrorResponse {
    error: string;
  }

  export interface AddQuestionFields {
    questionText: string | number,
    input: SelectInput,
    options: string | number
  }

}