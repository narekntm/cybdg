import Chance from "chance";
import { QuizManagerLoginPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import {
  QuizCreationData,
  QuizData,
  Question,
  QuestionType,
  Role,
  Submission,
  User,
  Users,
} from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

const chance = new Chance();

export function login(email: string, password: string) {
  QuizManagerLoginPage.emailInput().clear().type(email);
  QuizManagerLoginPage.passwordInput().clear().type(password);
  QuizManagerLoginPage.loginButton().click();
}

export function createQuiz(fakeQuiz: QuizCreationData): void {
  QuizManagerManagerViewPage.quizToggle().click();

  if (fakeQuiz.title) {
    QuizManagerManagerViewPage.quizTitleInput().type(fakeQuiz.title);
  }

  if (fakeQuiz.description) {
    QuizManagerManagerViewPage.quizDescriptionTextarea().type(fakeQuiz.description);
  }

  fakeQuiz.questions?.forEach((question) => {
    QuizManagerManagerViewPage.addQuestionButton().click();

    QuizManagerManagerViewPage.questionTitleInput(question.id).type(question.label);
    QuizManagerManagerViewPage.questionType(question.id).select(question.type);

    question.options?.forEach((option) => {
      QuizManagerManagerViewPage.questionOption(question.id).type(option).type("{enter}");
    });
  });

  if (fakeQuiz.assignedUsers?.length) {
    if (fakeQuiz.assignedUsers[0] === "all") {
      QuizManagerManagerViewPage.assignModeSelect().select("All Users");
    } else {
      QuizManagerManagerViewPage.assignModeSelect().select("Select Users");
      cy.intercept("GET", QuizManagerEndpoints.users).as("getUsers");

      cy.wait("@getUsers").then((interception) => {
        const allUsers = interception.response.body;
        fakeQuiz.assignedUsers.forEach((userId) => {
          const user = allUsers.find((u: Users) => u.id === userId);
          if (user) {
            QuizManagerManagerViewPage.assignedUsersByEmail(user.email).click();
          }
        });
      });
    }
  }

  QuizManagerManagerViewPage.saveQuizButton().click();
}

export function generateUser(role: Role): User {
  return {
    id: chance.guid(),
    email: chance.email({ domain: "example.com" }),
    password: chance.string({ length: 10 }),
    role,
  };
}

export function answerQuestion(question: Question): void {
  const nameSelector = `[name="${question.id}"]`;

  switch (question.type) {
    case QuestionType.Input:
      cy.get(`input${nameSelector}`).type(chance.sentence({ words: 3 }));
      break;

    case QuestionType.Radio:
      const radioOption = chance.pickone(question.options);
      cy.get(`input[type="radio"]${nameSelector}[value="${radioOption}"]`).check();
      break;

    case QuestionType.Checkbox:
      const selectedCheckboxes = chance.pickset(question.options, chance.integer({ min: 1, max: question.options.length }));
      selectedCheckboxes.forEach((option) => cy.get(`input[type="checkbox"]${nameSelector}[value="${option}"]`).check());
      break;

    case QuestionType.Dropdown:
      const dropdownOption = chance.pickone(question.options);
      cy.get(`select${nameSelector}`).select(dropdownOption);
      break;
  }
}
