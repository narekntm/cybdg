import Chance from 'chance';
import { UserManagementModels } from "Models/Lecture/UserManagementModels";

const chance = new Chance();

export class UserManagementGenerators {

  static userDataPositive() : UserManagementModels.UserInput {
    return {
      name: chance.name().split(" ")[0],
      role: chance.pickone(Object.values(UserManagementModels.Role)),
      age: chance.integer({
        min:1,
        max:100
      }),
      email: chance.email(),
      gender: chance.pickone(Object.values(UserManagementModels.Gender)),
      subscriptions: chance.pickset(Object.values(UserManagementModels.Subscription),
        chance.integer({
          min: 0,
          max: 2,
        })
      ),
    }
  }
}