import { Gender, Role, UserFormInput } from "Models/UserManagementModels";
import { getUserFormInput } from "TestDataAni/testData";

export class UserManagementGenerators {
  static adminUser: UserFormInput = getUserFormInput({
    name: "Admin",
    role: Role.admin,
    age: 5,
    email: "admin@test.test",
    gender: Gender.other,
  });
  static viewerUser: UserFormInput = getUserFormInput({
    name: "Viewer",
    role: Role.viewer,
    age: 50,
    email: "viewer@test.test",
    gender: Gender.male,
  });
}
