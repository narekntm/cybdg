import { UserManagementEndpoints } from "EndPoints/Arthur/UserManagementEndpoints";
import { UserManagementBuilders } from "Builders/Arthur/UserManagementBuilders";

describe('User Management Auth Tests', () => {

    it("Admin login - successfull login", () => {
        UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("success", true);
        });
    });

    it("Admin login - wrong email and password", () => {

        UserManagementBuilders.AdminLogin("Fake@fake.fake", "FakePassword").then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property("success", false);
        });
    });

    it("Admin login - correct email wrong password", () => {

        UserManagementBuilders.AdminLogin("admin@example.com", "FakePassword").then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property("success", false);
        });
    });

    it("Admin login - correct password wrong email", () => {

        UserManagementBuilders.AdminLogin("admiaddsasfn@example.com", "admin123").then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property("success", false);
        });
    });

    it("Admin login - empty email and pass", () => {

        UserManagementBuilders.AdminLogin("", "").then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property("success", false);
        });
    });







});