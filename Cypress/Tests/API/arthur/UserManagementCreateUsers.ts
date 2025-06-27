import { UserManagementBuilders } from "Builders/Arthur/UserManagementBuilders";
import { UserFormData } from "Models/Arthur/UserManagementModels";


describe('User Management Create Users Tests', () => {

    const baseUser: UserFormData = {
        name: "Fail",
        email: "failcase@example.com",
        role: "Viewer",
        age: "25",
        gender: "Male",
        subscriptions: ["Newsletter"],
    };

    function checkUserNotCreated(email: string) {
        UserManagementBuilders.GetUsers().then(({ status, body }) => {
            expect(status).to.eq(200);
            const emails = (body as UserFormData[]).map((u) => u.email);
            expect(emails).to.not.include(email);
        });
    }

    it('Should check user reset', () => {
        UserManagementBuilders.ResetData().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("success", true);
        });
        UserManagementBuilders.GetUsers().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an("array").with.length(3);
        });
    });

    it("Should create user with valid data", () => {
        UserManagementBuilders.CreateUser({
            name: "Arthur",
            email: "arthur@example.com",
            role: "Admin",
            age: "30",
            gender: "Male",
            subscriptions: ["Newsletter", "Product Updates"],
        }).then(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body).to.include({
                name: "Arthur",
                email: "arthur@example.com",
                role: "Admin",
                age: "30",
                gender: "Male",
                status: "Active",
            });

            const subs = body.subscriptions.split(",").map((s: string) => s.trim());
            expect(subs).to.have.members(["Newsletter", "Product Updates"]);
        });
    });

    it("Should not create user when name is empty", () => {
        const invalidUser: Partial<UserFormData> = { //Partial suggested by chatGPT
            name: "",
            email: "failtest@example.com",
            role: "Viewer",
            age: "25",
            gender: "Male",
            subscriptions: ["Newsletter"],
        };
        UserManagementBuilders.CreateUser(invalidUser).then(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body).to.have.property("error", "Missing fields");
        });
        UserManagementBuilders.GetUsers().then(({ status, body }) => {
            expect(status).to.eq(200);
            const emails = (body as UserFormData[]).map((u) => u.email);
            expect(emails).to.not.include(invalidUser.email);
        });
    });

    it("Should not create user when name is empty", () => {
        const user: Partial<UserFormData> = {
            ...baseUser,
            name: "",
            email: "empty-name@example.com",
        };
        UserManagementBuilders.CreateUser(user).then(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body).to.have.property("error", "Missing fields");
        });
        checkUserNotCreated(user.email!);
    });

    it("Should not create user when role is empty string", () => {
        UserManagementBuilders.CreateUser({
            ...baseUser,
            email: "empty-role@example.com",
            role: "",
        }).then(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body).to.have.property("error", "Missing fields");
        });

        checkUserNotCreated("empty-role@example.com");
    });

    it("Should not create user when age is empty", () => {
        UserManagementBuilders.CreateUser({
            ...baseUser,
            email: "empty-age@example.com",
            age: "",
        }).then(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body).to.have.property("error", "Missing fields");
        });

        checkUserNotCreated("empty-age@example.com");
    });

    it("Should not create user when email is empty", () => {
        const invalidUserName = "EmptyEmail";

        UserManagementBuilders.CreateUser({
            ...baseUser,
            email: "",
            name: invalidUserName,
        }).then(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body).to.have.property("error", "Missing fields");
        });

        UserManagementBuilders.GetUsers().then(({ status, body }) => {
            expect(status).to.eq(200);
            const names = (body as { name: string }[]).map(u => u.name);
            expect(names).to.not.include(invalidUserName);
        });
    });

    it("Should not create user when gender is empty", () => {
        UserManagementBuilders.CreateUser({
            ...baseUser,
            email: "empty-gender@example.com",
            gender: "",
        }).then(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body).to.have.property("error", "Missing fields");
        });

        checkUserNotCreated("empty-gender@example.com");
    });
});