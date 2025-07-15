import Chance from "chance";
import { UserManagementModels } from "Models/Lecture/UserManagementModels";

const chance = new Chance();

export class UserManagementGenerators {
  static defaultUser: UserManagementModels.UserInput = {
    name: "Narek",
    role: UserManagementModels.Role.Admin,
    age: 30,
    email: "narek@site",
    gender: UserManagementModels.Gender.Male,
    subscriptions: [UserManagementModels.Subscription.Newsletter, UserManagementModels.Subscription.ProductUpdates],
  };
  static userDataPositive(count: number = 1): UserManagementModels.UserInput[] {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push({
        name: chance.name().split(" ")[0], // Narek Hovhannisyan => [Narek, Hovhannisyan]
        role: chance.pickone(Object.values(UserManagementModels.Role)),
        age: chance.integer({ min: 1, max: 100 }),
        email: chance.email({
          domain: "site.com",
        }),
        gender: chance.pickone(Object.values(UserManagementModels.Gender)),
        subscriptions: chance.pickset(
          Object.values(UserManagementModels.Subscription),
          chance.integer({
            min: 0,
            max: 2,
          })
        ),
      });
    }
    return users;
  }
}
