import { UserManagementEndpoints } from "EndPoints/UserManagementEndpoints";
import { UserManagementBuilders } from "Builders/UserManagementBuilders";

describe('User Management Auth API Tests', () => {

    it.only("Admin login negative case", () => {

        UserManagementBuilders.AdminLogin("Fake@fake.fake", "FakePassword").then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property("success", false);
        });
    });

    





});