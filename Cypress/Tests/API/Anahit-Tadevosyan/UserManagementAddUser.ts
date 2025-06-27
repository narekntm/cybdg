import { UserManagementEndpoints } from "EndPoints/UserManagementEndPoints";
import { UserManagementBuilders } from "Builders/UserManagementBuilders";
import { UserManagementPage } from "Pages/UserManagementPage";
import { UserData} from "Models/UserManagementModel";

describe('User Management API Testing', () => {
    const baseUrl = "http://127.0.0.1:3000/";

    beforeEach(() => {
        cy.visit(baseUrl);
    });

    describe('Add new user', () => {
it('Add a user with valid data', () => {
    UserManagementBuilders
})
    });

});
