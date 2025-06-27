import { UserManagementBuilders } from "Builders/Arthur/UserManagementBuilders";
import { UserFormData } from "Models/Arthur/UserManagementModels";

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
            const updated: Partial<UserFormData> = {
                name: "Updated Name",
                email: "updated@example.com",
                role: "Editor",
                age: "40",
                gender: "Other",
                subscriptions: ["Newsletter", "Product Updates"],
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
                expect(subs).to.have.members(updated.subscriptions!);
            });
        });
    });

    it("Should return 404 when updating non-existing user", () => {
        UserManagementBuilders.UpdateUser(99999, {
            name: "Ghost",
            email: "ghost@example.com",
        }).then(({ status, body }) => {
            expect(status).to.eq(404);
            expect(body).to.have.property("error", "Not found");
        });
    });

    it("Should delete user as admin and verify in the list", () => {
        UserManagementBuilders.GetUsers().then(({ body }) => {
            const userToDelete = body.find((u: any) => u.role !== "Admin");
            expect(userToDelete).to.exist;

            UserManagementBuilders.DeleteUser(userToDelete.id, true).then(({ status, body }) => {
                expect(status).to.eq(200);
                expect(body).to.have.property("success", true);
            });

            UserManagementBuilders.GetUsers().then(({ body }) => {
                const ids = body.map((u: any) => u.id);
                expect(ids).to.not.include(userToDelete.id);
            });
        });
    });

    it("Should not allow deleting Admin user without admin rights", () => {
        UserManagementBuilders.GetUsers().then(({ body }) => {
            const adminUser = body.find((u: any) => u.role === "Admin");
            expect(adminUser).to.exist;

            UserManagementBuilders.DeleteUser(adminUser.id, false).then(({ status, body }) => {
                expect(status).to.eq(403);
                expect(body).to.have.property("error", "Admin login required");
            });
        });
    });

    it("Should return 404 when trying to delete a non-existing user", () => {
        const nonExistingId = 99999;

        UserManagementBuilders.DeleteUser(nonExistingId, true).then(({ status, body }) => {
            expect(status).to.eq(404);
            expect(body).to.have.property("error", "Not found");
        });
    });

    it("Should change status to Inactive and verify in list", () => {
        UserManagementBuilders.GetUsers().then(({ body }) => {
            const user = body.find((u: any) => u.status === "Active");
            expect(user).to.exist;

            UserManagementBuilders.ToggleUserStatus(user.id, "Inactive").then(({ status, body }) => {
                expect(status).to.eq(200);
                expect(body).to.include({ id: user.id, status: "Inactive" });
            });

            UserManagementBuilders.GetUsers().then(({ body }) => {
                const updatedUser = body.find((u: any) => u.id === user.id);
                expect(updatedUser).to.exist;
                expect(updatedUser.status).to.eq("Inactive");
            });
        });
    });

    it("Should change status to Active and verify in list", () => {
        UserManagementBuilders.GetUsers().then(({ body }) => {
            const user = body.find((u: any) => u.status === "Inactive");
            expect(user).to.exist;

            UserManagementBuilders.ToggleUserStatus(user.id, "Active").then(({ status, body }) => {
                expect(status).to.eq(200);
                expect(body).to.include({ id: user.id, status: "Active" });
            });

            UserManagementBuilders.GetUsers().then(({ body }) => {
                const updatedUser = body.find((u: any) => u.id === user.id);
                expect(updatedUser).to.exist;
                expect(updatedUser.status).to.eq("Active");
            });
        });
    });

    it("Should return 404 when trying to change status of non-existing user", () => {
        UserManagementBuilders.ToggleUserStatus(99999, "Inactive").then(({ status, body }) => {
            expect(status).to.eq(404);
            expect(body).to.have.property("error", "Not found");
        });
    });



});
