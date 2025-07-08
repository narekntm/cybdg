import { UserManagementBuilders } from "Builders/Arthur/UserManagementBuilders";
import { UserManagementGenerators } from "Generators/Arthur/UserManagementGenerator";
import { Status, UserErrorMessages, UserFormData } from "Models/Arthur/UserManagementModels";

describe("User Management Create Users Tests", () => {
  beforeEach(() => {
    UserManagementBuilders.ResetData().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("success", true);
    });
  });

  function checkUserNotCreated(email: string) {
    UserManagementBuilders.GetUsers().then(({ status, body }) => {
      expect(status).to.eq(200);
      const emails = (body as UserFormData[]).map((u) => u.email);
      expect(emails).to.not.include(email);
    });
  }

  it("Should check user reset", () => {
    UserManagementBuilders.GetUsers().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array").with.length(3);
    });
  });

  it("Should create user with valid data", () => {
    const user = UserManagementGenerators.validUser();

    UserManagementBuilders.CreateUser(user).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body).to.include({
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        status: Status.Active,
      });

      const subs = body.subscriptions.split(",").map((s: string) => s.trim());
      expect(subs).to.have.members(user.subscriptions);
    });
  });

  it("Should not create user when name is empty", () => {
    const user = UserManagementGenerators.withEmptyName();

    UserManagementBuilders.CreateUser(user, false).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body).to.deep.equal({ errors: [UserErrorMessages.EmptyName] });
    });

    checkUserNotCreated(user.email);
  });

  it("Should not create user when role is empty string", () => {
    const user = UserManagementGenerators.withEmptyRole();

    UserManagementBuilders.CreateUser(user, false).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body).to.deep.equal({ errors: [UserErrorMessages.EmptyRole] });
    });

    checkUserNotCreated(user.email);
  });

  it("Should not create user when age is empty", () => {
    const user = UserManagementGenerators.withEmptyAge();

    UserManagementBuilders.CreateUser(user, false).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body).to.deep.equal({ errors: [UserErrorMessages.InvalidAge] });
    });

    checkUserNotCreated(user.email);
  });

  it("Should not create user when email is empty", () => {
    const user = UserManagementGenerators.withEmptyEmail();

    UserManagementBuilders.CreateUser(user, false).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body).to.deep.equal({ errors: [UserErrorMessages.InvalidEmail] });
    });

    UserManagementBuilders.GetUsers().then(({ status, body }) => {
      expect(status).to.eq(200);
      const names = (body as { name: string }[]).map((u) => u.name);
      expect(names).to.not.include(user.name);
    });
  });

  it("Should not create user when gender is empty", () => {
    const user = UserManagementGenerators.withEmptyGender();

    UserManagementBuilders.CreateUser(user, false).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body).to.deep.equal({ errors: [UserErrorMessages.EmptyGender] });
    });

    checkUserNotCreated(user.email);
  });
});
