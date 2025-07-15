import * as Chance from "chance";
import { QuizManagerLoginModels } from "Models/David Models/QuizManagerModels/QuizManagerLoginModels";

const chance = new Chance();

export class QuizManagerGenerator {
  static ValidAdmin(): QuizManagerLoginModels.LoginModel {
    return {
      login: "admin@example.com",
      password: "admin123",
    };
  }

  static ValidUser1(): QuizManagerLoginModels.LoginModel {
    return {
      login: "user1@example.com",
      password: "user123",
    };
  }

  static ValidUser2(): QuizManagerLoginModels.LoginModel {
    return {
      login: "user2@example.com",
      password: "user123",
    };
  }

  static invalidUser(): QuizManagerLoginModels.LoginModel {
    return {
      login: chance.email(),
      password: chance.animal(),
    };
  }
  static emptyUser(): QuizManagerLoginModels.LoginModel {
    return {
      login: "",
      password: "",
    };
  }
}
