import Chance from "chance";
import { UserManagementBuilders } from "Builders/Arthur/UserManagementBuilders";
import { Gender, Role, Status, Subscription, User, UserErrorMessages, UserFormData } from "Models/Arthur/UserManagementModels";

const chance = new Chance();

describe("User Management Update User Tests", () => {
  beforeEach(() => {
    UserManagementBuilders.ResetData().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("success", true);
    });
  });

  it("Should update existing user with valid data", () => {
    UserManagementBuilders.GetUsers().then(({ body }) => {
      const user = body[0];

      const updated: UserFormData = {
        name: chance.first(),
        email: chance.email(),
        role: Role.Editor,
        age: chance.age({ type: "adult" }).toString(),
        gender: chance.pickone([Gender.Male, Gender.Female, Gender.Other]),
        subscriptions: chance.pickset([Subscription.Newsletter, Subscription.ProductUpdates], chance.integer({ min: 1, max: 3 })),
      };

      UserManagementBuilders.UpdateUser(user.id, updated).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.include({
          id: user.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          age: updated.age,
          gender: updated.gender,
        });

        const subs = body.subscriptions.split(",").map((s: string) => s.trim());
        expect(subs).to.have.members(updated.subscriptions);
      });
    });
  });

  it("Should return 404 when updating non-existing user", () => {
    const fakeUser: UserFormData = {
      name: chance.first(),
      email: chance.email(),
      role: Role.Viewer,
      age: chance.age({ type: "adult" }).toString(),
      gender: chance.pickone([Gender.Male, Gender.Female, Gender.Other]),
      subscriptions: [Subscription.Newsletter],
    };

    UserManagementBuilders.UpdateUser(99999, fakeUser).then(({ status }) => {
      expect(status).to.eq(404);
    });
  });

  it("Should delete user as admin and verify in the list", () => {
    UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
      const userToDelete = body.find((u: User) => u.role !== Role.Admin);
      expect(userToDelete).to.exist;

      UserManagementBuilders.DeleteUser(userToDelete.id, true).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.have.property("success", true);
      });

      UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
        const ids = body.map((u: User) => u.id);
        expect(ids).to.not.include(userToDelete.id);
      });
    });
  });

  it("Should return 404 when trying to delete a non-existing user", () => {
    const nonExistingId = 99999;

    UserManagementBuilders.DeleteUser(nonExistingId, true).then(({ status, body }) => {
      expect(status).to.eq(404);
      expect(body).to.deep.equal({ errors: [UserErrorMessages.UserNotFound] });
    });
  });

  it("Should change status to Inactive and verify in list", () => {
    UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
      const user = body.find((u: User) => u.status === Status.Active);
      expect(user).to.exist;

      UserManagementBuilders.ToggleUserStatus(user.id, Status.Inactive).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.include({ id: user.id, status: Status.Inactive });
      });

      UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
        const updatedUser = body.find((u: User) => u.id === user.id);
        expect(updatedUser).to.exist;
        expect(updatedUser.status).to.eq(Status.Inactive);
      });
    });
  });

  it("Should change status to Active and verify in list", () => {
    UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
      const user = body.find((u: User) => u.status === Status.Inactive);
      expect(user).to.exist;

      UserManagementBuilders.ToggleUserStatus(user.id, Status.Active).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.include({ id: user.id, status: Status.Active });
      });

      UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
        const updatedUser = body.find((u: User) => u.id === user.id);
        expect(updatedUser).to.exist;
        expect(updatedUser.status).to.eq(Status.Active);
      });
    });
  });

  it("Should return 404 when trying to change status of non-existing user", () => {
    UserManagementBuilders.ToggleUserStatus(99999, Status.Inactive).then(({ status, body }) => {
      expect(status).to.eq(404);
      expect(body).to.deep.equal({ errors: [UserErrorMessages.UserNotFound] });
    });
  });
});
