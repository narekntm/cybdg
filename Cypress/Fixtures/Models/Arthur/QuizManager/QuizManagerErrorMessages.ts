export enum AuthErrorMessages {
  InvalidCredentials = "Invalid credentials",
  Unauthorized = "Unauthorized",
  Forbidden = "Forbidden",
}

export enum QuizErrorMessages {
  QuizNotFound = "Quiz not found",
  QuizHasSubmissions = "Quiz has submissions",
  QuizNotEditable = "Quiz is not editable",
}

export enum SubmissionErrorMessages {
  AlreadySubmitted = "Already submitted",
  SubmissionNotFound = "Submission not found",
}

export enum ValidationErrorMessages {
  TitleRequired = "Quiz title cannot be empty.",
  DescriptionRequired = "Quiz description cannot be empty.",
  AtLeastOneQuestion = "At least one question is required.",
  AtLeastOneOption = "must have at least one option",
  CustomAssignmentMissingUsers = "Please select at least one user.",
}

export enum GeneralErrorMessages {
  NotFound = "Error: Not found",
  InternalServerError = "Internal Server Error",
  Forbidden = "Forbidden",
}
