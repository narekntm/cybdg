import { Chance } from "chance";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { Question, QuestionType, QuizRequest, UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";

const chance = new Chance();

export class UserBuilder {
  static validAdmin(): UserCredentials {
    return {
      id: "admin1",
      email: Cypress.env("ADMIN_EMAIL"),
      password: Cypress.env("ADMIN_PASSWORD"),
      role: UserRole.Admin,
    };
  }

  static validUser(): UserCredentials {
    return {
      id: "user1",
      email: Cypress.env("USER_EMAIL"),
      password: Cypress.env("USER_PASSWORD"),
      role: UserRole.User,
    };
  }

  static anotherValidUser(): UserCredentials {
    return {
      id: "user2",
      email: Cypress.env("USER2_EMAIL"),
      password: Cypress.env("USER2_PASSWORD"),
      role: UserRole.User,
    };
  }

  static invalidUser(): UserCredentials {
    return {
      id: "invalidUser",
      email: "nonexistent@example.com",
      password: "wrongpass",
    };
  }

  static withWrongPassword(): UserCredentials {
    return {
      id: "wrongUser",
      email: Cypress.env("USER_EMAIL"),
      password: "wrong123",
    };
  }

  static generateInvalidToken(): string {
    return chance.hash({ length: 32 });
  }

  static LoginRequest(user: UserCredentials, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.login,
      body: {
        email: user.email,
        password: user.password,
      },
      failOnStatusCode,
    });
  }
}

export class QuizBuilder {
  static generateQuestion(type: QuestionType, index: number): Question {
    const base = {
      id: `q${index}`,
      label: `Question ${index + 1} (${type})`,
      type,
    };

    switch (type) {
      case QuestionType.Input:
        return { ...base, options: [] };
      case QuestionType.SingleChoice:
      case QuestionType.MultipleChoice:
      case QuestionType.Dropdown:
        return {
          ...base,
          options: [chance.word(), chance.word(), chance.word()],
        };
    }
  }

  static generateValidQuiz(): QuizRequest {
    const title = [chance.word(), chance.word(), chance.word()].map((w) => chance.capitalize(w)).join(" ");
    const description = chance.sentence({ words: 5 });

    return {
      title,
      description,
      assignedUsers: "all",
      questions: [
        this.generateQuestion(QuestionType.Input, 0),
        this.generateQuestion(QuestionType.SingleChoice, 1),
        this.generateQuestion(QuestionType.MultipleChoice, 2),
        this.generateQuestion(QuestionType.Dropdown, 3),
      ],
    };
  }

  static generateQuizWithOnly(type: QuestionType): QuizRequest {
    const title = `Quiz with only ${type}`;
    const description = chance.sentence({ words: 6 });

    return {
      title,
      description,
      assignedUsers: "all",
      questions: [this.generateQuestion(type, 0)],
    };
  }
}
