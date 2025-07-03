import Chance from "chance";
import { UserManagementModels } from "Models/UserManagementModels";

export class UserManagementGenerators {
  static loginPositiveCase(): UserManagementModels.Login {
    return {
      email: "admin@example.com",
      password: "admin123",
    };
  }

  static loginNegativeCase(): UserManagementModels.Login {
    return {
      email: "",
      password: "",
    };
  }

  static userFormPositiveCase(): UserManagementModels.UserInput {
    return {
      name: "LarisaYeremyan",
      role: UserManagementModels.UserRole.Editor,
      age: 30,
      email: "larisayeremyan@gmail.com",
      gender: UserManagementModels.Gender.Female,
      subscriptions: [UserManagementModels.Subscription.Newsletter, UserManagementModels.Subscription.ProductUpdates],
    };
  }

  static userFormNegativeName(): UserManagementModels.UserInput {
    return {
      name: "Larisa Yeremyan",
      role: UserManagementModels.UserRole.Editor,
      age: 30,
      email: "larisayeremyan@gmail.com",
      gender: UserManagementModels.Gender.Female,
      subscriptions: [UserManagementModels.Subscription.Newsletter, UserManagementModels.Subscription.ProductUpdates],
    };
  }

  static userFormNegativeRole(): UserManagementModels.UserInput {
    return {
      name: "LarisaYeremyan",
      role: null,
      age: 30,
      email: "larisayeremyan@gmail.com",
      gender: UserManagementModels.Gender.Female,
      subscriptions: [UserManagementModels.Subscription.Newsletter, UserManagementModels.Subscription.ProductUpdates],
    };
  }

  static userFormNegativeAge(): UserManagementModels.UserInput {
    return {
      name: "LarisaYeremyan",
      role: UserManagementModels.UserRole.Editor,
      age: 200,
      email: "larisayeremyan@gmail.com",
      gender: UserManagementModels.Gender.Female,
      subscriptions: [UserManagementModels.Subscription.Newsletter, UserManagementModels.Subscription.ProductUpdates],
    };
  }

  static userFormNegativeEmail(): UserManagementModels.UserInput {
    return {
      name: "LarisaYeremyan",
      role: UserManagementModels.UserRole.Editor,
      age: 30,
      email: "",
      gender: UserManagementModels.Gender.Female,
      subscriptions: [UserManagementModels.Subscription.Newsletter, UserManagementModels.Subscription.ProductUpdates],
    };
  }

  static userFormNegativeGender(): UserManagementModels.UserInput {
    return {
      name: "LarisaYeremyan",
      role: UserManagementModels.UserRole.Editor,
      age: 30,
      email: "larisayeremyan@gmail.com",
      gender: null,
      subscriptions: [UserManagementModels.Subscription.Newsletter, UserManagementModels.Subscription.ProductUpdates],
    };
  }

  static seedUserData(): UserManagementModels.UserInput[] {
    const chance = new Chance();
    const users: UserManagementModels.UserInput[] = [];
    for (let i = 0; i < 50; i++) {
      users.push({
        name: chance.name().split(" ")[0],
        role: chance.pickone(Object.values(UserManagementModels.UserRole)),
        age: chance.integer({ min: 1, max: 100 }),
        email: chance.email(),
        gender: chance.pickone(Object.values(UserManagementModels.Gender)),
        subscriptions: chance.pickset(Object.values(UserManagementModels.Subscription), chance.integer({ min: 0, max: 3 })),
      });
    }

    return users;
  }
}
