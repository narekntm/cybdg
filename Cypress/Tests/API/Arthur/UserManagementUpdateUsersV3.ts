import { UserManagementBuilders } from "Builders/Arthur/UserManagementBuilders";
import { UserManagementGenerators } from "Generators/Arthur/UserManagementGenerator";
import { Role, Status, User, UserErrorMessages } from "Models/Arthur/UserManagementModels";

describe("User Management Update User Tests", () => {
  beforeEach(() => {
    UserManagementBuilders.ResetData().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("success", true);
    });
  });

  it("Should update existing user with valid data", () => {
    UserManagementBuilders.GetUsers().then(({ body }) => {
      expect(body, "Users list should not be empty").to.be.an("array").that.is.not.empty;
      const user = body[0];
      const updated = UserManagementGenerators.validUser();

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
    const fakeUser = UserManagementGenerators.validUser();

    UserManagementBuilders.GetUsers().then(({ body }) => {
      expect(body, "Users list should not be empty").to.be.an("array").that.is.not.empty;

      const maxId = Math.max(...body.map((u: User) => u.id));
      const nonExistingId = maxId + 1;

      UserManagementBuilders.UpdateUser(nonExistingId, fakeUser, false).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body).to.deep.equal({ errors: [UserErrorMessages.UserNotFound] });
      });
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
    UserManagementBuilders.GetUsers().then(({ body }) => {
      expect(body, "Users list should not be empty").to.be.an("array").that.is.not.empty;

      const maxId = Math.max(...body.map((u: User) => u.id));
      const nonExistingId = maxId + 1;

      UserManagementBuilders.DeleteUser(nonExistingId, true, false).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body).to.deep.equal({ errors: [UserErrorMessages.UserNotFound] });
      });
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
    UserManagementBuilders.GetUsers().then(({ body }) => {
      expect(body, "Users list should not be empty").to.be.an("array").that.is.not.empty;

      const maxId = Math.max(...body.map((u: User) => u.id));
      const nonExistingId = maxId + 1;

      UserManagementBuilders.ToggleUserStatus(nonExistingId, Status.Inactive, false).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body).to.deep.equal({ errors: [UserErrorMessages.UserNotFound] });
      });
    });
  });
});
