import Chance from "chance";
import { Gender, Role, Status, Subscription, UserFormData, UserFormDataMock, UserInput } from "Models/Arthur/UserManagementModels";

const chance = new Chance();

export class UserManagementGenerators {
  static validUser(): UserFormData {
    return {
      name: chance.first({ nationality: "en" }),
      email: chance.email(),
      role: chance.pickone(Object.values(Role)),
      age: chance.age({ type: "adult" }).toString(),
      gender: chance.pickone(Object.values(Gender)),
      subscriptions: chance.pickset(Object.values(Subscription), chance.integer({ min: 1, max: 2 })),
    };
  }

  static withEmptyName(): UserFormData {
    return {
      ...this.validUser(),
      name: "",
    };
  }

  static withEmptyRole(): UserFormData {
    return {
      ...this.validUser(),
      role: "",
    };
  }

  static withEmptyAge(): UserFormData {
    return {
      ...this.validUser(),
      age: "",
    };
  }

  static withEmptyEmail(): UserFormData {
    return {
      ...this.validUser(),
      email: "",
    };
  }

  static withEmptyGender(): UserFormData {
    return {
      ...this.validUser(),
      gender: "",
    };
  }

  static withSymbolsInName(): UserFormData {
    return {
      ...this.validUser(),
      name: "John@",
    };
  }

  static withNumbersInName(): UserFormData {
    return {
      ...this.validUser(),
      name: "John123",
    };
  }

  static withTooLongName(): UserFormData {
    return {
      ...this.validUser(),
      name: "ArthurTheGreatAndPowerfulKingOfTheBrits",
    };
  }

  static withEmailMissingAt(): UserFormData {
    return {
      ...this.validUser(),
      email: "invalidemail.com",
    };
  }

  static withEmailMissingDomain(): UserFormData {
    return {
      ...this.validUser(),
      email: "invalid@emailcom",
    };
  }

  static withEmailMissingUsername(): UserFormData {
    return {
      ...this.validUser(),
      email: "@test.test",
    };
  }

  static withDuplicateEmail(email: string): UserFormData {
    return {
      ...this.validUser(),
      email,
    };
  }

  static mockedUser(): UserFormDataMock {
    const subscriptions = chance.pickset(Object.values(Subscription), chance.integer({ min: 1, max: 2 }));
    return {
      ...this.validUser(),
      subscriptions: subscriptions.join(", "),
      status: Status.Active,
    };
  }

  static randomUserInput(): UserInput {
    return {
      name: chance.first(),
      role: chance.pickone(Object.values(Role)),
      age: chance.age({ type: "adult" }),
      email: chance.email(),
      gender: chance.pickone(Object.values(Gender)),
      subscriptions: chance.pickset(Object.values(Subscription), chance.integer({ min: 0, max: 2 })),
      status: chance.pickone(Object.values(Status)),
    };
  }

  static manyUserInputs(count: number): UserInput[] {
    return Array.from({ length: count }, () => this.randomUserInput());
  }

  static withLongRandomName(length = 25): UserFormData {
    return {
      ...this.validUser(),
      name: chance.string({ length, pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" }),
    };
  }
}
