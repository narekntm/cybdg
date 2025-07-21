import { Chance } from "chance";
import { UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";

const chance = new Chance();

export class UserGenerator {
  static invalidUser(): UserCredentials {
    return {
      id: "invalid",
      email: "noone@fake.com",
      password: "wrong",
      role: UserRole.User,
    };
  }

  static withWrongPassword(correctEmail: string): UserCredentials {
    return {
      id: "wrong",
      email: correctEmail,
      password: "incorrect",
      role: UserRole.User,
    };
  }

  static generateUser(role: UserRole): UserCredentials {
    const id = `id-${chance.hash({ length: 6 })}`;
    return {
      id,
      email: `${id}@quizz.com`,
      password: "test123",
      role,
    };
  }
}
