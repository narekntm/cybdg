import * as Chance from "chance";
import { UserManagementModels } from "Models/Lecture/UserManagementModels";
const chance = new Chance();

export class UserManagementGenerators {
  static generatedUsers(): UserManagementModels.User {
    return {
      name: chance.name().split(" ")[0],
      role: chance.pickone(Object.values(UserManagementModels.Role)),
      age: chance.integer({ min: 1, max: 100 }),
      email: chance.email({ domain: 'examples.com' }),
      gender: chance.pickone(Object.values(UserManagementModels.Gender)),
      subscriptions: chance.pickset(
        Object.values(UserManagementModels.Subscription),
        chance.integer({ min: 0, max: 3 })
      )
    }
  }

    static adminCredentials = {
      login: 'admin@example.com',
      password: 'admin123'
    }

    static validUser = {
      name: chance.name().split(" ")[0],
      email: `${Date.now()}@example.com`,
      role: chance.pickone(Object.values(UserManagementModels.Role)),
      age: chance.integer({min:1, max:100}),
      gender: chance.pickone(Object.values(UserManagementModels.Gender)),
      subscriptions: chance.pickset(Object.values((UserManagementModels.Subscription)),chance.integer({min:0, max:3}),)
    }
}