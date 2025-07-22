import Chance from "chance";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { Question, QuestionType, QuizCreationData, Role, User, Users } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerLoginPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";

const chance = new Chance();

export function login(email: string, password: string, checkCookies = true) {
  cy.intercept("POST", QuizManagerEndpoints.login()).as("postLogin");

  QuizManagerLoginPage.emailInput().clear().type(email);
  QuizManagerLoginPage.passwordInput().clear().type(password);
  QuizManagerLoginPage.loginButton().click();

  cy.wait("@postLogin").then(() => {
    if (checkCookies) {
      cy.getCookies().should("not.be.empty");
      cy.getCookie("authToken").should("exist");
    }
  });
}

export function logout() {
  QuizManagerManagerViewPage.logoutButton().click();
  cy.getCookie("authToken").should("not.exist");
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

    const labelInput = QuizManagerManagerViewPage.questionTitleInput(question.id);
    labelInput.clear();
    if (question.label) {
      labelInput.type(question.label);
    }
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
      selectedCheckboxes.forEach((option) => {
        cy.get(`input[type="checkbox"]${nameSelector}[value="${option}"]`).check();
      });
      break;

    case QuestionType.Dropdown:
      const dropdownOption = chance.pickone(question.options);
      cy.get(`select${nameSelector}`).select(dropdownOption);
      break;
  }
}

export function answerQuiz(quiz: { questions: Question[] }): Cypress.Chainable<Record<string, string | string[]>> {
  const answers: Record<string, string | string[]> = {};

  quiz.questions.forEach((question) => {
    const nameSelector = `[name="${question.id}"]`;

    switch (question.type) {
      case QuestionType.Input:
        const inputText = chance.sentence({ words: 3 });
        cy.get(`input${nameSelector}`).type(inputText);
        answers[question.id] = inputText;
        break;

      case QuestionType.Radio:
        const radioOption = chance.pickone(question.options);
        cy.get(`input[type="radio"]${nameSelector}[value="${radioOption}"]`).check();
        answers[question.id] = radioOption;
        break;

      case QuestionType.Checkbox:
        const selected = chance.pickset(question.options, chance.integer({ min: 1, max: question.options.length }));
        selected.forEach((opt) => {
          cy.get(`input[type="checkbox"]${nameSelector}[value="${opt}"]`).check();
        });
        answers[question.id] = selected;
        break;

      case QuestionType.Dropdown:
        const selectedOption = chance.pickone(question.options);
        cy.get(`select${nameSelector}`).select(selectedOption);
        answers[question.id] = selectedOption;
        break;
    }
  });

  return cy.wrap(answers);
}
