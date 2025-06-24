import { UserManagementBuilders } from "Builders/UserManagementBuilders";

describe('User Management Users API Tests', () => {

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
});